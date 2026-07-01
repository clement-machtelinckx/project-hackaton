import { POST } from "@/app/api/chat/route";
import { generateChatAnswer, MistralClientError } from "@/lib/llm/client";
import { SMALL_TALK_ANSWER } from "@/lib/llm/small-talk";
import type { MistralErrorCode } from "@/lib/llm/types";
import type { ChatResponse } from "@/types/chat";

/**
 * Garde-fou "anti-dérive" #3 — orchestration de POST /api/chat.
 *
 * La route est la dernière barrière avant le LLM. On verrouille des comportements
 * déterministes SANS aucun appel réseau (le client Mistral est mocké — on ne
 * mocke QUE la frontière) :
 *  - question hors-corpus (0 extrait) → message de refus, AUCUN appel au LLM ;
 *  - question couverte → le LLM est appelé UNIQUEMENT avec le contexte ancré,
 *    et les sources renvoyées proviennent des extraits ;
 *  - requête invalide → 400, sans toucher au LLM.
 * Objectif : prouver que le bot refuse au lieu d'inventer.
 */
jest.mock("@/lib/llm/client", () => ({
    generateChatAnswer: jest.fn(),
    MistralClientError: class MistralClientError extends Error {
        constructor(public readonly code: string) {
            super(code);
            this.name = "MistralClientError";
        }
    },
}));

const generateChatAnswerMock = generateChatAnswer as jest.MockedFunction<typeof generateChatAnswer>;

function postChat(body: unknown): Promise<Response> {
    return POST(
        new Request("http://localhost/api/chat", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: typeof body === "string" ? body : JSON.stringify(body),
        }),
    );
}

function userQuestion(content: string): { messages: Array<{ role: string; content: string }> } {
    return { messages: [{ role: "user", content }] };
}

afterEach(() => {
    jest.clearAllMocks();
});

describe("Garde-fou anti-dérive — POST /api/chat (orchestration RAG)", () => {
    it("refuse une question hors-corpus sans appeler le LLM", async () => {
        const response = await postChat(userQuestion("Explique la photosynthèse des plantes vertes."));
        const payload = (await response.json()) as ChatResponse;

        expect(response.status).toBe(200);
        expect(payload.sources).toEqual([]);
        expect(payload.answer.toLowerCase()).toContain("je ne peux pas répondre");
        expect(generateChatAnswerMock).not.toHaveBeenCalled();
    });

    it("répond à une salutation (small talk) sans appeler le LLM", async () => {
        const response = await postChat(userQuestion("bonjour"));
        const payload = (await response.json()) as ChatResponse;

        expect(response.status).toBe(200);
        expect(payload.answer).toBe(SMALL_TALK_ANSWER);
        expect(payload.sources).toEqual([]);
        expect(generateChatAnswerMock).not.toHaveBeenCalled();
    });

    it("n'appelle le LLM qu'avec le contexte documentaire ancré, pour une question couverte", async () => {
        generateChatAnswerMock.mockResolvedValue("Un bloc se valide selon le règlement. (Source : Règlement)");

        const response = await postChat(userQuestion("Comment valider un bloc de compétences ?"));
        const payload = (await response.json()) as ChatResponse;

        expect(response.status).toBe(200);
        expect(generateChatAnswerMock).toHaveBeenCalledTimes(1);

        const { context } = generateChatAnswerMock.mock.calls[0][0];
        expect(context).toContain("--- DÉBUT DU CONTEXTE DOCUMENTAIRE ---");
        expect(context).toContain("[Extrait de :");

        expect(payload.sources.length).toBeGreaterThan(0);
        expect(payload.sources[0].documentTitle).toBeTruthy();
    });

    it("rejette un corps non-JSON en 400 sans toucher au LLM", async () => {
        const response = await postChat("{ ceci n'est pas du json");

        expect(response.status).toBe(400);
        expect(generateChatAnswerMock).not.toHaveBeenCalled();
    });

    it.each([
        ["conversation vide", { messages: [] }],
        ["dernier message non-utilisateur", { messages: [{ role: "assistant", content: "bonjour" }] }],
    ])("rejette une requête invalide (%s) en 400", async (_label, body) => {
        const response = await postChat(body);

        expect(response.status).toBe(400);
        expect(generateChatAnswerMock).not.toHaveBeenCalled();
    });
});

/**
 * Garde-fou "anti-dérive" #3 bis — échecs du LLM.
 *
 * Quand Mistral tombe, la route ne doit ni halluciner une réponse ni divulguer
 * le détail interne : elle mappe chaque code d'erreur vers un statut HTTP public
 * et un message neutre. On mocke le client pour simuler chaque panne.
 */
describe("Garde-fou anti-dérive — POST /api/chat (échecs LLM)", () => {
    it.each<[MistralErrorCode, number]>([
        ["MISTRAL_TIMEOUT", 504],
        ["MISTRAL_NOT_CONFIGURED", 503],
        ["MISTRAL_RATE_LIMIT", 429],
    ])("mappe l'échec LLM %s vers le statut HTTP %i", async (code, status) => {
        generateChatAnswerMock.mockRejectedValue(new MistralClientError(code));

        const response = await postChat(userQuestion("Comment valider un bloc de compétences ?"));

        expect(response.status).toBe(status);
    });

    it("renvoie 500 sans divulguer le détail interne pour une erreur inconnue", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        generateChatAnswerMock.mockRejectedValue(new Error("panne interne confidentielle"));

        const response = await postChat(userQuestion("Comment valider un bloc de compétences ?"));
        const payload = (await response.json()) as { error: string };

        expect(response.status).toBe(500);
        expect(payload.error).not.toContain("panne interne confidentielle");

        consoleErrorSpy.mockRestore();
    });
});
