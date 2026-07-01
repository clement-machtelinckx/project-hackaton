// Détection des messages de politesse / salutations (small talk) qui ne sont pas
// des questions documentaires. Objectif : répondre chaleureusement et inviter à
// poser une vraie question, plutôt que de tomber sur le message « je ne peux pas
// répondre ».

const SMALL_TALK_WORDS = new Set([
    "bonjour",
    "bonsoir",
    "salut",
    "coucou",
    "hello",
    "hi",
    "hey",
    "yo",
    "cc",
    "merci",
    "beaucoup",
    "bonne",
    "journee",
    "soiree",
    "au",
    "revoir",
    "ca",
    "sa",
    "va",
    "comment",
    "allez",
    "vous",
    "bien",
    "super",
    "ok",
    "test",
]);

export function isSmallTalk(question: string): boolean {
    const normalized = question
        .toLocaleLowerCase("fr")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (!normalized) return true;

    const words = normalized.split(" ").filter(Boolean);
    // Un message court composé uniquement de mots de politesse = small talk.
    if (words.length === 0 || words.length > 5) return false;
    return words.every((word) => SMALL_TALK_WORDS.has(word));
}

export const SMALL_TALK_ANSWER =
    "Bonjour ! 👋 Je suis l'assistant de l'équipe pédagogique Ynov. Posez-moi une question sur la certification, le référentiel, les règlements ou la scolarité, et j'y répondrai.";
