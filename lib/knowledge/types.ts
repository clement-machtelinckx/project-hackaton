export type KnowledgeSection = {
    id: string;
    title: string;
    content: string;
};

export type KnowledgeDocument = {
    id: string;
    title: string;
    shortTitle: string;
    category: string;
    description: string;
    source: string;
    updatedAt?: string;
    sections: KnowledgeSection[];
};

export type KnowledgeDocumentSummary = Omit<KnowledgeDocument, "sections" | "updatedAt">;

export type KnowledgeChunk = {
    id: string;
    documentId: string;
    documentTitle: string;
    sectionId: string;
    sectionTitle: string;
    content: string;
};

export type RetrievedChunk = KnowledgeChunk & {
    score: number;
};
