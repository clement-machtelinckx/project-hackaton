import referentielRncp39583 from "./referentiel-rncp39583.json";
import reglementSpecialRncp39583 from "./reglement-special-rncp39583.json";
import modalitesEvaluationRncp39583 from "./modalites-evaluation-rncp39583.json";
import reglementGeneralYnov from "./reglement-general-ynov.json";
import certificatScolarite from "./certificat-scolarite.json";
import titreRncpBlocsCompetences from "./titre-rncp-blocs-competences.json";
import reglementPedagogiqueYnov from "./reglement-pedagogique-ynov.json";
import reglementInterieurYnov from "./reglement-interieur-ynov.json";
import titreCdaRncp37873 from "./titre-cda-rncp37873.json";
import formationsYnov from "./formations-ynov.json";
import type { KnowledgeDocument } from "@/lib/knowledge/types";

// Corpus réel Ynov. Certifications : Expert en développement logiciel (RNCP39583,
// Mastère) et Concepteur développeur d'applications (RNCP37873, Bachelor).
// Les règlements généraux et la scolarité s'appliquent à toutes les certifications.
export const knowledgeDocuments: KnowledgeDocument[] = [
    referentielRncp39583,
    reglementSpecialRncp39583,
    modalitesEvaluationRncp39583,
    titreCdaRncp37873,
    formationsYnov,
    reglementGeneralYnov,
    reglementPedagogiqueYnov,
    reglementInterieurYnov,
    titreRncpBlocsCompetences,
    certificatScolarite,
];
