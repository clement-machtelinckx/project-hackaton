export type ChatRole = "user" | "assistant";

export type ChatSource = {
    id: string;
    documentId: string;
    documentTitle: string;
    sectionTitle: string;
    excerpt: string;
};

export type ChatMessage = {
    id: string;
    role: ChatRole;
    content: string;
    sources?: ChatSource[];
};

export type ChatRequestMessage = Pick<ChatMessage, "role" | "content">;

export type ChatResponse = {
    answer: string;
    sources: ChatSource[];
};
