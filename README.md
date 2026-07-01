# Campus Copilot

Campus Copilot est un prototype de hackathon : un copilote étudiant qui répond en français à partir de documents pédagogiques stockés localement. Le MVP privilégie une démonstration simple, compréhensible et facilement déployable.

## Fonctionnement

Les documents JSON restent côté serveur dans `data/knowledge/`. À chaque question, le serveur :

1. découpe les sections en passages déterministes ;
2. normalise la question et calcule un score lexical ;
3. sélectionne au maximum cinq passages pertinents ;
4. transmet uniquement ces passages au fournisseur LLM ;
5. retourne la réponse et les sources affichées dans le chat.

Ce mini-RAG n’utilise ni embeddings ni base vectorielle.

## Stack

- Next.js 16, App Router et React 19 ;
- TypeScript et Tailwind CSS 4 ;
- shadcn/ui et lucide-react ;
- Zod pour la validation de l’API ;
- `fetch` natif vers une API compatible Chat Completions.

## Lancement

Prérequis : Node.js 20 ou une version ultérieure.

```bash
npm install
cp .env.example .env.local
npm run dev
```

L’application est disponible sur `http://localhost:3000`.

```bash
npm run lint
npm run build
npm start
```

## Configuration LLM

Créer `.env.local` sans jamais committer de clé réelle :

```env
LLM_API_KEY=...
LLM_BASE_URL=https://api.example.com/v1
LLM_MODEL=...
```

`LLM_BASE_URL` doit cibler la racine compatible Chat Completions ; Campus Copilot ajoute `/chat/completions`. Sans ces trois variables, une question pertinente retourne un statut `503`. Une question sans contexte pertinent reçoit une réponse locale honnête, sans appel LLM.

## Architecture simplifiée

```text
app/api/chat/          Route POST du chatbot
components/chat/       Interface et état local de conversation
components/documents/  Liste des métadonnées documentaires
data/knowledge/        Documents JSON importés côté serveur
lib/knowledge/         Découpage et recherche lexicale
lib/llm/               Prompt et client HTTP du fournisseur
types/chat.ts          Contrat des messages et sources
```

## Ajouter un document

1. Créer un fichier JSON dans `data/knowledge/`.
2. Respecter le type `KnowledgeDocument` défini dans `lib/knowledge/types.ts`.
3. Importer le fichier dans `data/knowledge/index.ts` et l’ajouter à `knowledgeDocuments`.
4. Redémarrer ou redéployer l’application.

Chaque contenu de démonstration doit être remplacé par une source pédagogique officielle avant un usage réel.

## Limites du MVP

- aucun upload, parsing PDF/DOCX ou OCR ;
- aucune base de données, authentification ou persistance de l’historique ;
- aucune recherche sémantique, base vectorielle ou embeddings ;
- recherche lexicale sensible au vocabulaire employé ;
- documents fournis uniquement pour la démonstration et non contractuels ;
- dépendance à une API externe compatible Chat Completions pour générer les réponses.
