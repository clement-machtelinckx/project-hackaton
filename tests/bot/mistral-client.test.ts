import { generateChatAnswer } from "@/lib/llm/client";
import type { GenerateChatAnswerInput } from "@/lib/llm/types";

/**
 * Garde-fou "anti-dérive" #4 — le client Mistral.
 *
 * generateChatAnswer est la seule sortie réseau du bot. On mocke `fetch` (aucun
 * appel réel) pour verrouiller, de façon déterministe :
 *  - la configuration (pas de clé / clé mal formée → erreurs typées, sans réseau) ;
 *  - la requête envoyée (SYSTEM_PROMPT + contexte en message system, safe_prompt,
 *    historique borné) — le modèle est toujours ancré ;
 *  - le mapping des statuts HTTP et des réponses inexploitables → codes d'erreur ;
 *  - les pannes réseau (timeout / réseau) → codes d'erreur, jamais une réponse inventée.
 */
const realFetch = global.fetch;
const fetchMock = jest.fn();

function jsonResponse(payload: unknown): Response {
    return {
        ok: true,
        status: 200,
        json: async () => payload,
        text: async () => JSON.stringify(payload),
    } as unknown as Response;
}

function errorResponse(status: number): Response {
    return {
        ok: false,
        status,
        json: async () => ({}),
        text: async () => "détail fournisseur",
    } as unknown as Response;
}

const input: GenerateChatAnswerInput = {
    messages: [{ role: "user", content: "Comment valider un bloc de compétences ?" }],
    context: "--- CONTEXTE ---",
};

function configure(): void {
    process.env.LLM_API_KEY = "sk-test-123";
}

const ENV_KEYS = [
    "MISTRAL_API_KEY",
    "MISTRAL_MODEL",
    "MISTRAL_BASE_URL",
    "LLM_API_KEY",
    "LLM_MODEL",
    "LLM_BASE_URL",
] as const;

const OLD_ENV = process.env;

beforeAll(() => {
    global.fetch = fetchMock as unknown as typeof fetch;
});

afterAll(() => {
    global.fetch = realFetch;
    process.env = OLD_ENV;
});

beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV };
    for (const key of ENV_KEYS) delete process.env[key];
});

describe("Garde-fou anti-dérive — client Mistral (generateChatAnswer)", () => {
    describe("configuration", () => {
        it("échoue en MISTRAL_NOT_CONFIGURED sans clé, sans appeler le réseau", async () => {
            await expect(generateChatAnswer(input)).rejects.toHaveProperty(
                "code",
                "MISTRAL_NOT_CONFIGURED",
            );
            expect(fetchMock).not.toHaveBeenCalled();
        });

        it("échoue en MISTRAL_AUTHENTICATION_ERROR si la clé est entourée de guillemets", async () => {
            process.env.LLM_API_KEY = '"sk-quoted"';

            await expect(generateChatAnswer(input)).rejects.toHaveProperty(
                "code",
                "MISTRAL_AUTHENTICATION_ERROR",
            );
            expect(fetchMock).not.toHaveBeenCalled();
        });
    });

    describe("requête envoyée à Mistral", () => {
        it("transmet SYSTEM_PROMPT + contexte en message system, avec safe_prompt", async () => {
            configure();
            fetchMock.mockResolvedValue(
                jsonResponse({ choices: [{ message: { content: "Réponse ancrée." } }] }),
            );

            const answer = await generateChatAnswer(input);

            expect(answer).toBe("Réponse ancrée.");
            expect(fetchMock).toHaveBeenCalledTimes(1);

            const [url, init] = fetchMock.mock.calls[0];
            expect(String(url)).toContain("/chat/completions");
            const body = JSON.parse(init.body);
            expect(body.messages[0].role).toBe("system");
            expect(body.messages[0].content).toContain("Campus Copilot");
            expect(body.messages[0].content).toContain("--- CONTEXTE ---");
            expect(body.safe_prompt).toBe(true);
            expect(init.headers.Authorization).toBe("Bearer sk-test-123");
        });

        it("borne l'historique aux 6 derniers messages", async () => {
            configure();
            fetchMock.mockResolvedValue(
                jsonResponse({ choices: [{ message: { content: "ok" } }] }),
            );
            const many: GenerateChatAnswerInput = {
                messages: Array.from({ length: 8 }, (_, i) => ({
                    role: "user" as const,
                    content: `m${i}`,
                })),
                context: "c",
            };

            await generateChatAnswer(many);

            const body = JSON.parse(fetchMock.mock.calls[0][1].body);
            // 1 message system + au plus 6 messages d'historique
            expect(body.messages).toHaveLength(7);
            expect(body.messages.slice(1).map((m: { content: string }) => m.content)).toEqual([
                "m2",
                "m3",
                "m4",
                "m5",
                "m6",
                "m7",
            ]);
        });
    });

    describe("erreurs HTTP mappées vers un code typé", () => {
        it.each<[number, string]>([
            [401, "MISTRAL_AUTHENTICATION_ERROR"],
            [402, "MISTRAL_ACCESS_ERROR"],
            [403, "MISTRAL_ACCESS_ERROR"],
            [429, "MISTRAL_RATE_LIMIT"],
            [500, "MISTRAL_PROVIDER_ERROR"],
        ])("statut HTTP %i -> %s", async (status, code) => {
            configure();
            fetchMock.mockResolvedValue(errorResponse(status));

            await expect(generateChatAnswer(input)).rejects.toHaveProperty("code", code);
        });
    });

    describe("réponses inexploitables (jamais de réponse inventée)", () => {
        it("JSON illisible -> MISTRAL_PROVIDER_ERROR", async () => {
            configure();
            fetchMock.mockResolvedValue({
                ok: true,
                status: 200,
                json: async () => {
                    throw new Error("json cassé");
                },
                text: async () => "",
            } as unknown as Response);

            await expect(generateChatAnswer(input)).rejects.toHaveProperty(
                "code",
                "MISTRAL_PROVIDER_ERROR",
            );
        });

        it("payload sans choices -> MISTRAL_EMPTY_RESPONSE", async () => {
            configure();
            fetchMock.mockResolvedValue(jsonResponse({}));

            await expect(generateChatAnswer(input)).rejects.toHaveProperty(
                "code",
                "MISTRAL_EMPTY_RESPONSE",
            );
        });

        it("contenu vide -> MISTRAL_EMPTY_RESPONSE", async () => {
            configure();
            fetchMock.mockResolvedValue(
                jsonResponse({ choices: [{ message: { content: "   " } }] }),
            );

            await expect(generateChatAnswer(input)).rejects.toHaveProperty(
                "code",
                "MISTRAL_EMPTY_RESPONSE",
            );
        });
    });

    describe("pannes réseau", () => {
        it("timeout (AbortError) -> MISTRAL_TIMEOUT", async () => {
            configure();
            const abort = new Error("timeout");
            abort.name = "AbortError";
            fetchMock.mockRejectedValue(abort);

            await expect(generateChatAnswer(input)).rejects.toHaveProperty(
                "code",
                "MISTRAL_TIMEOUT",
            );
        });

        it("panne réseau -> MISTRAL_NETWORK_ERROR", async () => {
            configure();
            fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));

            await expect(generateChatAnswer(input)).rejects.toHaveProperty(
                "code",
                "MISTRAL_NETWORK_ERROR",
            );
        });
    });
});
