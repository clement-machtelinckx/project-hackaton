import { SYSTEM_PROMPT } from "./prompts";
import type {
    GenerateChatAnswerInput,
    MistralChatResponse,
    MistralContentChunk,
    MistralErrorCode,
} from "./types";

const DEFAULT_BASE_URL = "https://api.mistral.ai/v1";
const DEFAULT_MODEL = "mistral-small-latest";
const REQUEST_TIMEOUT_MS = 25_000;
const MAX_HISTORY_MESSAGES = 6;

type MistralConfig = {
    apiKey: string;
    baseUrl: string;
    model: string;
};

export class MistralClientError extends Error {
    constructor(public readonly code: MistralErrorCode) {
        super(code);
        this.name = "MistralClientError";
    }
}

function getMistralConfig(): MistralConfig {
    const apiKey = (process.env.MISTRAL_API_KEY?.trim() || process.env.LLM_API_KEY?.trim()) ?? "";
    const model =
        process.env.MISTRAL_MODEL?.trim() || process.env.LLM_MODEL?.trim() || DEFAULT_MODEL;
    const baseUrl =
        process.env.MISTRAL_BASE_URL?.trim() ||
        process.env.LLM_BASE_URL?.trim() ||
        DEFAULT_BASE_URL;

    if (!apiKey) {
        throw new MistralClientError("MISTRAL_NOT_CONFIGURED");
    }

    if (/^["']|["']$/.test(apiKey)) {
        throw new MistralClientError("MISTRAL_AUTHENTICATION_ERROR");
    }

    return {
        apiKey,
        model,
        baseUrl: baseUrl.replace(/\/+$/, ""),
    };
}

function isMistralContentChunk(value: unknown): value is MistralContentChunk {
    return (
        typeof value === "object" &&
        value !== null &&
        (!("text" in value) || typeof value.text === "string")
    );
}

function isMistralChatResponse(value: unknown): value is MistralChatResponse {
    return (
        typeof value === "object" &&
        value !== null &&
        "choices" in value &&
        Array.isArray(value.choices)
    );
}

function extractMistralText(content: string | MistralContentChunk[] | undefined): string {
    if (typeof content === "string") return content.trim();
    if (!Array.isArray(content)) return "";

    return content
        .filter(isMistralContentChunk)
        .map((chunk) => chunk.text?.trim() ?? "")
        .filter(Boolean)
        .join("\n")
        .trim();
}

function errorCodeForStatus(status: number): MistralErrorCode {
    if (status === 401) return "MISTRAL_AUTHENTICATION_ERROR";
    if (status === 402 || status === 403) return "MISTRAL_ACCESS_ERROR";
    if (status === 429) return "MISTRAL_RATE_LIMIT";
    return "MISTRAL_PROVIDER_ERROR";
}

function isTimeoutError(error: unknown): boolean {
    return error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
}

export async function generateChatAnswer({
    messages,
    context,
}: GenerateChatAnswerInput): Promise<string> {
    const { apiKey, baseUrl, model } = getMistralConfig();
    const history = messages.slice(-MAX_HISTORY_MESSAGES).map(({ role, content }) => ({
        role,
        content,
    }));

    try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model,
                messages: [
                    {
                        role: "system",
                        content: `${SYSTEM_PROMPT}\n\n${context}`,
                    },
                    ...history,
                ],
                temperature: 0.2,
                max_tokens: 1500,
                stream: false,
                safe_prompt: true,
            }),
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("Erreur HTTP Mistral", {
                status: response.status,
                model,
            });
            throw new MistralClientError(errorCodeForStatus(response.status));
        }

        let payload: unknown;
        try {
            payload = await response.json();
        } catch {
            throw new MistralClientError("MISTRAL_PROVIDER_ERROR");
        }
        if (!isMistralChatResponse(payload)) {
            throw new MistralClientError("MISTRAL_EMPTY_RESPONSE");
        }

        const answer = extractMistralText(payload.choices?.[0]?.message?.content);
        if (!answer) {
            throw new MistralClientError("MISTRAL_EMPTY_RESPONSE");
        }

        return answer;
    } catch (error: unknown) {
        if (error instanceof MistralClientError) throw error;
        if (isTimeoutError(error)) {
            throw new MistralClientError("MISTRAL_TIMEOUT");
        }
        throw new MistralClientError("MISTRAL_NETWORK_ERROR");
    }
}
