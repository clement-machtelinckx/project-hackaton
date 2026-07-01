# Campus Copilot

Campus Copilot est un assistant pédagogique qui répond en français à partir de documents de formation indexés. Son architecture privilégie un fonctionnement simple, compréhensible et facilement déployable.

## Fonctionnement

Les documents JSON restent côté serveur dans `data/knowledge/`. À chaque question, le serveur :

1. découpe les sections en passages déterministes ;
2. normalise la question et calcule un score lexical ;
3. sélectionne au maximum cinq passages pertinents ;
4. transmet uniquement ces passages à Mistral ;
5. retourne la réponse Mistral et les sources calculées par le serveur.

Ce mini-RAG n’utilise ni embeddings ni base vectorielle.

## Stack

- Next.js 16, App Router et React 19 ;
- TypeScript et Tailwind CSS 4 ;
- shadcn/ui et lucide-react ;
- Zod pour la validation de l’API ;
- `fetch` natif vers l’API REST Mistral Chat Completions.

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

## Configuration Mistral

Créer `.env.local` sans jamais committer de clé réelle :

```env
MISTRAL_API_KEY=...
MISTRAL_MODEL=mistral-small-latest
MISTRAL_BASE_URL=https://api.mistral.ai/v1
```

Next.js charge automatiquement `.env.local` au démarrage. La clé reste exclusivement côté serveur et ne doit jamais utiliser le préfixe `NEXT_PUBLIC_`.

`MISTRAL_MODEL` et `MISTRAL_BASE_URL` ont des valeurs par défaut. Pendant la migration, les anciens noms `LLM_API_KEY`, `LLM_MODEL` et `LLM_BASE_URL` restent acceptés comme fallbacks, mais `MISTRAL_*` est la convention recommandée.

## Route `/api/chat`

`POST /api/chat` valide la conversation avec Zod, sélectionne au maximum cinq passages avec le mini-RAG, puis envoie à Mistral un message système contenant le prompt et le contexte délimité. Seuls les six derniers messages utiles sont transmis. Les sources sont construites par le serveur à partir des passages récupérés ; Mistral ne les génère pas.

Sans contexte documentaire, la route répond immédiatement avec `sources: []` et n’appelle pas Mistral. Sans clé pour une question pertinente, elle retourne un statut `503` sans exposer de détail secret.

## Erreur Unauthorized

Un fichier `.env.local` est lu par Next.js, mais ses variables ne sont pas automatiquement exportées dans un terminal Bash. `echo "$MISTRAL_API_KEY"` ne produit une valeur que si la variable est réellement chargée ; évitez toutefois d’afficher une clé dans un environnement partagé ou dans des logs.

Pour charger temporairement le fichier sans placer la clé directement dans une commande enregistrée dans l’historique :

```bash
set -a
source .env.local
set +a
```

Un test direct peut ensuite être effectué :

```bash
curl https://api.mistral.ai/v1/chat/completions \
  -X POST \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mistral-small-latest",
    "temperature": 0.2,
    "max_tokens": 100,
    "messages": [
      {
        "role": "user",
        "content": "Réponds uniquement avec : connexion réussie"
      }
    ]
  }'
```

Un statut `401 Unauthorized` indique généralement que la variable n’était pas chargée dans le shell, ou que la clé est invalide, inactive ou liée à un workspace sans accès. Vérifiez aussi l’absence de guillemets littéraux ou d’espaces parasites dans la configuration. Ne publiez jamais la valeur pendant le diagnostic.

## Erreurs fréquentes

- `503 — Le service IA n’est pas configuré` : clé absente du processus Next.js.
- `503 — La clé Mistral est absente ou invalide` : réponse `401` de Mistral.
- `503 — Le compte Mistral ne permet pas d’utiliser ce modèle` : accès ou modèle refusé.
- `429` : limite de requêtes atteinte.
- `502` : réseau, réponse vide ou erreur fournisseur.
- `504` : délai de 25 secondes dépassé.

## Architecture simplifiée

```text
app/api/chat/          Route POST du chatbot
components/chat/       Interface et état local de conversation
components/documents/  Liste des métadonnées documentaires
data/knowledge/        Documents JSON importés côté serveur
lib/knowledge/         Découpage et recherche lexicale
lib/llm/               Prompt et client REST Mistral
types/chat.ts          Contrat des messages et sources
```

## Ajouter un document

1. Créer un fichier JSON dans `data/knowledge/`.
2. Respecter le type `KnowledgeDocument` défini dans `lib/knowledge/types.ts`.
3. Importer le fichier dans `data/knowledge/index.ts` et l’ajouter à `knowledgeDocuments`.
4. Redémarrer ou redéployer l’application.

Le corpus doit être validé par l’établissement avant un usage institutionnel.

## Périmètre fonctionnel actuel

- aucun upload, parsing PDF/DOCX ou OCR ;
- aucune base de données, authentification ou persistance de l’historique ;
- aucune recherche sémantique, base vectorielle ou embeddings ;
- recherche lexicale sensible au vocabulaire employé ;
- corpus à valider par l’établissement avant un usage institutionnel ;
- dépendance à l’API Mistral pour générer les réponses.
