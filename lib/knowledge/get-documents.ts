import { knowledgeDocuments } from "@/data/knowledge";
import { chunkDocuments } from "./chunk-documents";
import type { KnowledgeDocumentSummary } from "./types";

export function getKnowledgeDocuments() {
    return knowledgeDocuments;
}

export function getDocumentSummaries(): KnowledgeDocumentSummary[] {
    return knowledgeDocuments.map(({ id, title, shortTitle, category, description, source }) => ({
        id,
        title,
        shortTitle,
        category,
        description,
        source,
    }));
}

export function getKnowledgeChunks() {
    return chunkDocuments(knowledgeDocuments);
}
