import cursusCda from "./cursus-cda.json";
import ficheRncp from "./fiche-rncp.json";
import reglementMastere from "./reglement-mastere.json";
import type { KnowledgeDocument } from "@/lib/knowledge/types";

export const knowledgeDocuments: KnowledgeDocument[] = [cursusCda, ficheRncp, reglementMastere];
