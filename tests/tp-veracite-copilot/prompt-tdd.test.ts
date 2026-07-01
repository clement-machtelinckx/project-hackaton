import * as fs from "fs";
import * as path from "path";

/**
 * Pont Jest du harnais de véracité — Campus Copilot (adapté de tp-tdd-prompt-po).
 *
 * Le vrai "runner" est un agent-juge (voir AGENT.md) : il incarne le VRAI prompt
 * de prod (constante SYSTEM_PROMPT de lib/llm/prompts.ts) ancré sur le VRAI corpus
 * (data/knowledge/*.json), joue le chatbot sur chaque cas de test-cases.json, se
 * dédouble en juge impartial, puis écrit results.json. Ce fichier ne fait qu'AGRÉGER
 * ce verdict en une barre verte/rouge `npm test`.
 *
 * - results.json absent  -> tests en veille (le `npm test` du projet reste vert).
 * - results.json présent -> couverture de tous les cas écrits + un test par cas
 *   (vert seulement si verdict PASS ET aucune attente non satisfaite).
 *
 * Nous sommes AUTEURS DE TESTS : un cas rouge se signale au dev (qui durcit
 * lib/llm/prompts.ts), il ne se "corrige" pas ici.
 */

interface ExpectationResult {
    text: string;
    met: boolean;
    comment?: string;
}

interface CaseResult {
    id: string;
    category?: string;
    title?: string;
    userPrompt?: string;
    chatbotResponse?: string;
    expectationResults?: ExpectationResult[];
    verdict?: "PASS" | "FAIL";
    score?: number;
    rationale?: string;
}

interface Results {
    meta?: Record<string, unknown>;
    summary?: { total?: number; passed?: number; failed?: number; score?: number };
    cases?: CaseResult[];
}

interface SpecCase {
    id: string;
    title: string;
    category: string;
    expectations: string[];
}

interface Spec {
    cases: SpecCase[];
}

const DIR = __dirname;
const RESULTS_PATH = path.join(DIR, "results.json");
const SPEC_PATH = path.join(DIR, "test-cases.json");

function readJson<T>(file: string): T {
    return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
}

function verdictOf(c: CaseResult): "PASS" | "FAIL" {
    if (c.verdict) return c.verdict === "PASS" ? "PASS" : "FAIL";
    const exp = c.expectationResults ?? [];
    return exp.length > 0 && exp.every((e) => e.met) ? "PASS" : "FAIL";
}

const spec = readJson<Spec>(SPEC_PATH);

describe("Véracité · Campus Copilot (juge LLM sur le vrai prompt)", () => {
    if (!fs.existsSync(RESULTS_PATH)) {
        // eslint-disable-next-line no-console
        console.info(
            "[veracite] Aucun results.json dans tests/tp-veracite-copilot/.\n" +
                "  -> Lance le juge : demande à ton agent de suivre AGENT.md (« Relance le juge — itération 1 RED »),\n" +
                "     puis ouvre index.html ou relance `npm test`.",
        );
        it.skip("results.json absent — lance le juge LLM (voir AGENT.md)", () => {
            /* en veille tant que le juge n'a pas produit de run */
        });
        return;
    }

    const results = readJson<Results>(RESULTS_PATH);
    const cases = results.cases ?? [];

    it("chaque cas écrit dans test-cases.json a bien été jugé", () => {
        const seen = new Set(cases.map((c) => c.id));
        const missing = spec.cases.filter((s) => !seen.has(s.id)).map((s) => s.id);
        expect(missing).toEqual([]);
    });

    describe("chaque cas doit être au vert (PASS, toutes attentes satisfaites)", () => {
        for (const s of spec.cases) {
            it(`${s.id} — ${s.title}`, () => {
                const c = cases.find((r) => r.id === s.id);
                expect(c).toBeDefined();
                if (!c) return;

                const resultTexts = (c.expectationResults ?? []).map((e) => e.text);
                // Fidélité au protocole AGENT.md : le juge doit avoir évalué CHAQUE attente de
                // test-cases.json (mêmes libellés). Sinon un results.json partiel (le juge est un
                // LLM) pourrait passer au vert en omettant silencieusement des attentes.
                const uncovered = s.expectations.filter((t) => !resultTexts.includes(t));

                const verdict = verdictOf(c);
                const failedExpectations = (c.expectationResults ?? [])
                    .filter((e) => !e.met)
                    .map((e) => e.text);

                // En cas d'échec, Jest affiche cet objet -> on voit POURQUOI c'est rouge.
                expect({ verdict, failedExpectations, uncovered, rationale: c.rationale }).toMatchObject({
                    verdict: "PASS",
                    failedExpectations: [],
                    uncovered: [],
                });
            });
        }
    });
});
