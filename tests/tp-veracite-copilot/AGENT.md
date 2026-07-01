# 🧑‍⚖️ Protocole du juge LLM — véracité Campus Copilot (à donner à ton agent)

> Pas de clé API, pas de provider imposé : **ton agent de code EST le test runner.**
> Claude Code, Codex, Cursor… colle le bloc ci-dessous (ou dis :
> « **Suis le protocole de `AGENT.md` dans ce dossier** »).
>
> ⚠️ **Notre rôle = auteur de tests.** On écrit les cas dans `test-cases.json` (depuis
> [`backlog-po-rncp.md`](backlog-po-rncp.md)). Le prompt **sous test** est le **VRAI prompt de
> prod** : la constante `SYSTEM_PROMPT` de [`lib/llm/prompts.ts`](../../lib/llm/prompts.ts).
> **On ne modifie JAMAIS `lib/llm/prompts.ts`.** Un cas rouge se **signale au dev**, qui durcit
> le prompt jusqu'au vert.

---

## 📋 Prompt à coller à l'agent

```
Tu es le « juge LLM » du harnais de véracité de Campus Copilot. Tu travailles dans le
dossier tests/tp-veracite-copilot/. Procède ainsi, sans rien me demander :

DÉCLENCHEUR — Quand je dis « Relance le juge — itération N RED » ou « … itération N GREEN »,
tu refais TOUTES les étapes ci-dessous avec l'état ACTUEL du prompt de prod et des cas, puis
tu écris meta.iteration = N et tu écrases results.json. RED/GREEN n'est que le contexte
attendu (RED = cas juste écrit, on attend l'échec ; GREEN = le dev a durci le prompt, on
attend le succès).

1. LIS le prompt SOUS TEST : la constante SYSTEM_PROMPT de lib/llm/prompts.ts (chemin réel
   depuis ce dossier : ../../lib/llm/prompts.ts). LIS aussi le corpus ancré :
   data/knowledge/*.json (../../data/knowledge/). Enfin LIS test-cases.json (les cas que
   J'ÉCRIS). La suite grandit au fil du TP : tu juges TOUS les cas présents.

2. Pour CHAQUE cas, en DEUX temps bien séparés :
   a) RÔLE CHATBOT — Tu incarnes STRICTEMENT et UNIQUEMENT Campus Copilot défini par
      SYSTEM_PROMPT. Pour le userPrompt, tu te bases UNIQUEMENT sur les sections du corpus
      réellement pertinentes (récupération lexicale simple sur les mots-clés du userPrompt,
      comme lib/knowledge/retrieve-context.ts). Si aucune section n'est pertinente, le
      chatbot DOIT refuser (il ne dispose pas de l'info). Tu ne triches pas : si le prompt
      ne couvre pas encore une règle, le chatbot se comporte mal (c'est le but : RED). Tu
      n'ajoutes AUCUNE règle absente de SYSTEM_PROMPT.
   b) RÔLE JUGE — Tu oublies la réponse que tu viens d'écrire et tu l'évalues de façon
      IMPARTIALE et STRICTE, attente par attente. « met:true » seulement si la réponse
      satisfait CLAIREMENT l'attente ; au moindre doute -> false. Le verdict est "PASS"
      UNIQUEMENT si TOUTES les attentes sont met:true, sinon "FAIL".

3. ÉCRIS le résultat dans results.json (à côté de ces fichiers), STRICTEMENT au format de
   results.schema.json. Reprends les id, title, category, userPrompt et le libellé EXACT de
   chaque attente depuis test-cases.json. Renseigne meta.scenario, meta.systemPromptFile
   ("lib/llm/prompts.ts"), meta.corpusSource ("data/knowledge/*.json"), meta.agent,
   meta.model, meta.iteration et meta.timestamp. Ajoute chatbotResponse (la réponse jouée)
   et un rationale par cas.

4. NE MODIFIE PAS lib/llm/prompts.ts, ni le corpus, ni test-cases.json. Tu ne touches qu'à
   results.json.

5. Termine par : « X/Y au vert (Z%) — cas en échec : … » et rappelle-moi d'ouvrir index.html
   (ou de lancer `npm test`). Pour chaque cas ROUGE, résume l'indice de correction à
   transmettre au dev (ex. « ajouter au prompt : ne jamais produire de code de compétence »).
```

---

## 🔁 La boucle TDD (auteur de tests ⇄ dev)

1. **J'écris UN cas** (depuis une story de `backlog-po-rncp.md`) dans `test-cases.json`.
2. Je lance l'agent (ce protocole) → le nouveau cas doit être **FAIL** (🔴 RED).
   *S'il est déjà PASS, mon test est trop faible ou le prompt couvre déjà : je le renforce.*
3. **Je signale le rouge au dev** (cas + réponse réelle + indice de correction).
4. **Le dev durcit `lib/llm/prompts.ts`** (moi je n'y touche pas).
5. Je relance l'agent → le cas passe **PASS** (🟢 GREEN), sans casser les autres. Story suivante.

## 🎯 Règles d'or pour un juge fiable

- **Sépare les deux rôles** (chatbot puis juge) : le même modèle fait les deux → biais
  d'auto-complaisance → jugement **strict**, attente par attente.
- **Le chatbot ne triche pas** : il n'obéit qu'à `SYSTEM_PROMPT` + le contexte réellement récupéré.
- **PASS = tout vert.** Une seule attente non satisfaite => FAIL.
- **Fidélité des libellés** : `id` et textes d'attentes identiques à `test-cases.json`
  (le pont Jest vérifie que chaque cas écrit a bien été jugé).

## ✅ Voir le résultat

- **Visuel** : ouvre [`index.html`](index.html) et glisse-dépose ton `results.json`
  (ou sers le dossier avec « Live Server » pour l'auto-chargement).
- **Barre verte** : `npm test` — le pont Jest passe au vert quand tous les cas écrits sont PASS.
  *(Filtrer : `npm test -- tp-veracite-copilot`.)*
