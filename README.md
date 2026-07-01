# Document AI

Application de hackathon destinée à l’analyse de documents avec l’intelligence artificielle. Le dépôt contient actuellement le socle d’interface ; les fonctionnalités IA ne sont pas encore développées.

## Stack technique

- Next.js 16 avec App Router
- React 19 et TypeScript
- Tailwind CSS 4
- shadcn/ui
- lucide-react

## Développement

Prérequis : Node.js 20 ou une version ultérieure.

```bash
npm install
npm run dev
```

L’application est ensuite disponible sur `http://localhost:3000`.

Commandes utiles :

```bash
npm run lint
npm run build
npm start
```

## État actuel

Le projet propose une page d’accueil minimale, un layout responsive et les composants shadcn/ui nécessaires aux prochaines étapes.

- L’import de documents n’est pas encore implémenté.
- Le chat IA n’est pas encore implémenté.
- Aucun fournisseur LLM n’est choisi ni configuré.
- Aucune base de données, authentification ou architecture RAG n’est configurée.

## Fonctionnalités prévues

- import et consultation de documents ;
- questions-réponses basées sur leur contenu ;
- génération de résumés et d’analyses ;
- recommandations et conseils générés par un LLM.
