const FRENCH_STOP_WORDS = new Set([
    "le",
    "la",
    "les",
    "un",
    "une",
    "des",
    "de",
    "du",
    "et",
    "ou",
    "au",
    "aux",
    "dans",
    "sur",
    "pour",
    "par",
    "avec",
    "est",
    "sont",
    "etre",
    "avoir",
    "que",
    "qui",
    "quoi",
    "comment",
]);

export function normalizeText(text: string): string {
    return text
        .toLocaleLowerCase("fr")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function tokenize(text: string): string[] {
    return normalizeText(text)
        .split(/[\s-]+/)
        .filter((word) => word.length > 2 && !FRENCH_STOP_WORDS.has(word));
}
