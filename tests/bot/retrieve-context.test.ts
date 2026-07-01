import { retrieveContext } from "@/lib/knowledge/retrieve-context";

/**
 * Garde-fou "anti-dérive" #1 — ancrage documentaire.
 *
 * La récupération lexicale est la première barrière contre l'hallucination :
 * si aucune source pertinente n'est trouvée, la route /api/chat renvoie le
 * message de refus au lieu de laisser le LLM inventer une réponse.
 * On verrouille donc ce comportement par des tests déterministes (aucun appel réseau).
 */
describe("Garde-fou anti-dérive — retrieveContext (récupération lexicale)", () => {
    it("renvoie [] pour une question hors-corpus (doit déclencher le refus)", () => {
        expect(retrieveContext("Explique la photosynthèse des plantes vertes.")).toEqual([]);
    });

    it("renvoie [] pour une question vide ou réduite à des mots vides", () => {
        expect(retrieveContext("")).toEqual([]);
        expect(retrieveContext("le la les des")).toEqual([]);
    });

    it("remonte des extraits pertinents pour une question couverte par le corpus", () => {
        const result = retrieveContext("Comment valider un bloc de compétences ?");

        expect(result.length).toBeGreaterThan(0);
        expect(result[0].score).toBeGreaterThan(0);
    });
});
