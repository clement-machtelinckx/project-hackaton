import type { KnowledgeChunk, KnowledgeDocument } from "./types";

const MAX_CHUNK_LENGTH = 1_200;
const CHUNK_OVERLAP = 180;

function splitContent(content: string): string[] {
    if (content.length <= MAX_CHUNK_LENGTH) {
        return [content];
    }

    const chunks: string[] = [];
    let start = 0;

    while (start < content.length) {
        let end = Math.min(start + MAX_CHUNK_LENGTH, content.length);

        if (end < content.length) {
            const sentenceEnd = content.lastIndexOf(". ", end);
            if (sentenceEnd > start + MAX_CHUNK_LENGTH / 2) {
                end = sentenceEnd + 1;
            }
        }

        chunks.push(content.slice(start, end).trim());
        if (end === content.length) break;
        start = Math.max(end - CHUNK_OVERLAP, start + 1);
    }

    return chunks;
}

export function chunkDocuments(documents: KnowledgeDocument[]): KnowledgeChunk[] {
    return documents.flatMap((document) =>
        document.sections.flatMap((section) =>
            splitContent(section.content).map((content, index) => ({
                id: `${document.id}-${section.id}-${index + 1}`,
                documentId: document.id,
                documentTitle: document.title,
                sectionId: section.id,
                sectionTitle: section.title,
                content,
            })),
        ),
    );
}
