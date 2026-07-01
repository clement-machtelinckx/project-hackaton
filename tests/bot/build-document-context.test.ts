import type { RetrievedChunk } from "@/lib/knowledge/types";
import { buildDocumentContext } from "@/lib/llm/prompts";

/**
 * Garde-fou "anti-dérive" #2 — le contexte remis au LLM.
 *
 * buildDocumentContext emballe les extraits récupérés dans un bloc balisé
 * transmis au modèle. On verrouille son format : le LLM ne reçoit que du contenu
 * documentaire clairement délimité (pas de fuite de champs internes comme le
 * score), pour qu'il s'appuie sur les sources et n'invente rien. Fonction pure,
 * aucun mock nécessaire.
 */
function makeChunk(overrides: Partial<RetrievedChunk> = {}): RetrievedChunk {
    return {
        id: "doc-1#sec-1",
        documentId: "doc-1",
        documentTitle: "Règlement pédagogique Mastère",
        sectionId: "sec-1",
        sectionTitle: "Modalités d'évaluation",
        content: "Chaque bloc est évalué par un projet et une soutenance.",
        score: 12,
        ...overrides,
    };
}

describe("Garde-fou anti-dérive — buildDocumentContext (contexte remis au LLM)", () => {
    it("encadre les sources par les marqueurs de début et de fin", () => {
        const context = buildDocumentContext([makeChunk()]);

        expect(context).toContain("--- DÉBUT DU CONTEXTE DOCUMENTAIRE ---");
        expect(context).toContain("--- FIN DU CONTEXTE DOCUMENTAIRE ---");
    });

    it("rend un extrait par chunk, dans l'ordre reçu", () => {
        const context = buildDocumentContext([
            makeChunk({ id: "a", documentTitle: "Doc A" }),
            makeChunk({ id: "b", documentTitle: "Doc B" }),
        ]);

        expect(context).toContain("[Extrait de : Doc A");
        expect(context).toContain("[Extrait de : Doc B");
        expect(context.indexOf("Doc A")).toBeLessThan(context.indexOf("Doc B"));
    });

    it("expose le document, la section et le contenu de chaque extrait", () => {
        const context = buildDocumentContext([
            makeChunk({
                documentTitle: "Référentiel RNCP39583",
                sectionTitle: "Validation d'un bloc de compétences",
                content: "Un bloc est validé lorsque toutes ses compétences sont acquises.",
            }),
        ]);

        expect(context).toContain(
            "[Extrait de : Référentiel RNCP39583 — Validation d'un bloc de compétences]",
        );
        expect(context).toContain(
            "Un bloc est validé lorsque toutes ses compétences sont acquises.",
        );
    });

    it("ne divulgue pas les champs internes (id, score) au modèle", () => {
        const context = buildDocumentContext([makeChunk({ id: "secret-id", score: 999 })]);

        expect(context).not.toContain("secret-id");
        expect(context).not.toContain("999");
        expect(context).not.toMatch(/score/i);
    });
});
