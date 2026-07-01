import referentielRncp39583 from "./referentiel-rncp39583.json";
import reglementSpecialRncp39583 from "./reglement-special-rncp39583.json";
import modalitesEvaluationRncp39583 from "./modalites-evaluation-rncp39583.json";
import reglementGeneralYnov from "./reglement-general-ynov.json";
import certificatScolarite from "./certificat-scolarite.json";
import titreRncpBlocsCompetences from "./titre-rncp-blocs-competences.json";
import reglementPedagogiqueYnov from "./reglement-pedagogique-ynov.json";
import reglementInterieurYnov from "./reglement-interieur-ynov.json";
import type { KnowledgeDocument } from "@/lib/knowledge/types";

// Corpus réel Ynov (certification RNCP39583 + scolarité). Les anciens documents
// de démonstration génériques ont été retirés car ils polluaient la recherche.
export const knowledgeDocuments: KnowledgeDocument[] = [
    referentielRncp39583,
    reglementSpecialRncp39583,
    modalitesEvaluationRncp39583,
    reglementGeneralYnov,
    reglementPedagogiqueYnov,
    reglementInterieurYnov,
    titreRncpBlocsCompetences,
    certificatScolarite,
];
