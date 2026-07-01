import { getKnowledgeChunks } from "./get-documents";
import { normalizeText, tokenize } from "./normalize";
import type { KnowledgeChunk, RetrievedChunk } from "./types";

const MAX_RESULTS = 5;

function countOccurrences(text: string, word: string): number {
    return text.split(word).length - 1;
}

function scoreChunk(chunk: KnowledgeChunk, words: string[], normalizedQuestion: string): number {
    const documentTitle = normalizeText(chunk.documentTitle);
    const sectionTitle = normalizeText(chunk.sectionTitle);
    const content = normalizeText(chunk.content);

    const wordScore = words.reduce((score, word) => {
        const titleScore = documentTitle.includes(word) ? 5 : 0;
        const sectionScore = sectionTitle.includes(word) ? 3 : 0;
        const contentScore = Math.min(countOccurrences(content, word), 3);
        return score + titleScore + sectionScore + contentScore;
    }, 0);

    const phraseBonus =
        normalizedQuestion.length >= 8 &&
        (documentTitle.includes(normalizedQuestion) ||
            sectionTitle.includes(normalizedQuestion) ||
            content.includes(normalizedQuestion))
            ? 8
            : 0;

    return wordScore + phraseBonus;
}

export function retrieveContext(question: string, limit = MAX_RESULTS): RetrievedChunk[] {
    const words = [...new Set(tokenize(question))];
    if (words.length === 0) return [];

    const normalizedQuestion = normalizeText(question);

    return getKnowledgeChunks()
        .map((chunk) => ({ ...chunk, score: scoreChunk(chunk, words, normalizedQuestion) }))
        .filter((chunk) => chunk.score > 0)
        .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
        .slice(0, Math.min(limit, MAX_RESULTS));
}
