import { SYSTEM_PROMPT } from "./prompts";
import type { GenerateChatAnswerInput } from "./types";

const REQUEST_TIMEOUT_MS = 20_000;
const MAX_PREVIOUS_MESSAGES = 6;

export class LlmConfigurationError extends Error {}
export class LlmTimeoutError extends Error {}
export class LlmProviderError extends Error {}

type ChatCompletionResponse = {
    choices?: Array<{
        message?: {
            content?: string;
        };
    }>;
};

function getConfiguration() {
    const apiKey = process.env.LLM_API_KEY;
    const baseUrl = process.env.LLM_BASE_URL;
    const model = process.env.LLM_MODEL;

    if (!apiKey || !baseUrl || !model) {
        throw new LlmConfigurationError("Le fournisseur LLM n’est pas configuré.");
    }

    return { apiKey, baseUrl: baseUrl.replace(/\/$/, ""), model };
}

function isChatCompletionResponse(value: unknown): value is ChatCompletionResponse {
    if (typeof value !== "object" || value === null || !("choices" in value)) return false;
    return Array.isArray(value.choices);
}

export async function generateChatAnswer({
    messages,
    context,
}: GenerateChatAnswerInput): Promise<string> {
    const { apiKey, baseUrl, model } = getConfiguration();
    const currentQuestion = messages.at(-1);
    const history = [
        ...messages.slice(0, -1).slice(-MAX_PREVIOUS_MESSAGES),
        ...(currentQuestion ? [currentQuestion] : []),
    ];

    try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model,
                temperature: 0.2,
                max_tokens: 1500,
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "system", content: context },
                    ...history,
                ],
            }),
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });

        if (!response.ok) {
            throw new LlmProviderError("Le fournisseur LLM a refusé la requête.");
        }

        const payload: unknown = await response.json();
        if (!isChatCompletionResponse(payload)) {
            throw new LlmProviderError("Réponse inattendue du fournisseur LLM.");
        }

        const answer = payload.choices?.[0]?.message?.content?.trim();
        if (!answer) {
            throw new LlmProviderError("Le fournisseur LLM n’a retourné aucun texte.");
        }

        return answer;
    } catch (error: unknown) {
        if (error instanceof LlmProviderError) throw error;
        if (error instanceof DOMException && error.name === "TimeoutError") {
            throw new LlmTimeoutError("La réponse a pris trop de temps.");
        }
        throw new LlmProviderError("Impossible de joindre le fournisseur LLM.");
    }
}
