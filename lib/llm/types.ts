import type { ChatRequestMessage } from "@/types/chat";

export type GenerateChatAnswerInput = {
    messages: ChatRequestMessage[];
    context: string;
};
