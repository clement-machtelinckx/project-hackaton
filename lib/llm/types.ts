import type { ChatRequestMessage } from "@/types/chat";

export type GenerateChatAnswerInput = {
    messages: ChatRequestMessage[];
    context: string;
};

export type MistralContentChunk = {
    type?: string;
    text?: string;
};

export type MistralChatResponse = {
    choices?: Array<{
        message?: {
            role?: string;
            content?: string | MistralContentChunk[];
        };
    }>;
};

export type MistralErrorCode =
    | "MISTRAL_NOT_CONFIGURED"
    | "MISTRAL_TIMEOUT"
    | "MISTRAL_NETWORK_ERROR"
    | "MISTRAL_AUTHENTICATION_ERROR"
    | "MISTRAL_ACCESS_ERROR"
    | "MISTRAL_RATE_LIMIT"
    | "MISTRAL_PROVIDER_ERROR"
    | "MISTRAL_EMPTY_RESPONSE";
