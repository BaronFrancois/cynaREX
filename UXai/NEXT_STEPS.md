# UXai — Prochaines etapes priorisees

**Date :** 2026-05-04
**Source :** AUDIT.md + PLAN.md + CDC.md
**Logique de priorite :** valeur produit / effort / risque.

---

## Sprint 1 — boucler le cycle (1 a 2 semaines)

L'objectif de ce sprint est de transformer le prototype "demonstrateur" en outil "utilisable en pre-production". Le critere : un utilisateur peut creer un projet, le sauvegarder, le partager, le rouvrir et generer un export consommable par un LLM.

### Ticket S1-1 — Bouton Reset visible

**Effort :** 30 min.
**Dependances :** aucune.
**Description.** Ajouter un bouton "Reinitialiser" dans la topbar a cote du bouton "Voir l'export". Au clic : confirmation, puis `clearStoredProject()` + recharge.

**Acceptance.**

- bouton present dans la topbar ;
- confirmation modal avant action ;
- localStorage vide apres confirmation ;
- page rechargee avec etat initial.

### Ticket S1-2 — Import de projet (boucler avec l'export)

**Effort :** 2 a 4 h.
**Dependances :** S1-1.
**Description.** Permettre a l'utilisateur de coller / charger un `uxai.project.json` exporte precedemment et de l'ouvrir dans l'editeur.

**Acceptance.**

- bouton "Importer" dans la topbar ou drawer d'export ;
- upload de fichier OU collage de JSON ;
- validation du schema (rootId existe, nodes coherents) ;
- replace state.project + render ;
- gestion d'erreur lisible si le JSON est invalide.

### Ticket S1-3 — Migration de schema localStorage

**Effort :** 1 a 2 h.
**Dependances :** aucune.
**Description.** Quand le modele evolue (futur ajout de champs), eviter qu'une sauvegarde ancienne plante l'app au load. Mecanisme :

```js
const MIGRATIONS = {
  1: (data) => data, // schema initial
  2: (data) => { /* migrer v1 -> v2 */ return data; }
};

function migrate(data) {
  let current = data.version || 1;
  while (current < CURRENT_VERSION) {
    data = MIGRATIONS[current + 1](data);
    current++;
  }
  data.version = CURRENT_VERSION;
  return data;
}
```

**Acceptance.**

- une sauvegarde v1 chargee dans v2 est migree, pas rejetee ;
- si la migration echoue, fallback sur etat par defaut + warning visible.

### Ticket S1-4 — Export React / Tailwind reel (page d'accueil minimum)

**Effort :** 1 a 2 jours.
**Dependances :** aucune.
**Description.** Generer un fichier `pages/Home.tsx` reel a partir du modele, avec :

- composants React fonctionnels ;
- props inferees du modele ;
- classes Tailwind issues des styles tokens ;
- imports propres (`@/components/...`).

**Strategie.** Walker recursif sur l'arbre de noeuds, generer du JSX par mapping :

```js
function nodeToJsx(node, depth) {
  const tag = roleToTag(node.role); // header, nav, button, section
  const className = stylesToTailwind(node.styles);
  const children = node.children.map((id) => nodeToJsx(getNode(id), depth + 1)).join("\n");
  const text = node.text ? escapeJsx(node.text) : "";
  return `<${tag} className="${className}">${text}${children}</${tag}>`;
}
```

**Acceptance.**

- export `pages/Home.tsx` valide TypeScript ;
- fichier compile dans un projet Next.js ou Vite vierge avec Tailwind installe ;
- structure visuelle alignee sur le canvas UXai.

### Ticket S1-5 — Application builder editeur (routes au minimum)

**Effort :** 1 jour.
**Dependances :** aucune.
**Description.** Transformer le panneau Application builder en editeur :

- ajouter / supprimer une route (path, methode, garde) ;
- editer la route active ;
- exporter la liste vers le bundle ;
- documenter les contraintes attendues du LLM (qui implemente la route).

**Acceptance.**

- ajout d'une route via un formulaire integre ;
- export inclut les routes dans `IMPLEMENTATION_GUIDE.md` ;
- au moins un test manuel : creer route `/about`, exporter, verifier presence dans le bundle.

### Critere de fin de sprint 1

A la fin de S1, un utilisateur peut :

1. ouvrir l'app vierge ;
2. taper un prompt et generer une UI ;
3. iterer localement sur des elements ;
4. fermer l'app, la rouvrir, retrouver son projet (deja OK) ;
5. exporter un bundle, le donner a un developpeur, ce dernier obtient un fichier React / Tailwind compilable ;
6. importer un bundle existant pour le re-editer.

## Sprint 2 — passage a l'application (2 a 3 semaines)

### Ticket S2-1 — Bibliotheque drag-to-canvas

**Effort :** 1 a 2 jours.
**Description.** Le panneau Assets liste deja les composants (Button, Input, Card, Nav). Permettre de les glisser dans une section du canvas pour les ajouter comme enfants.

**Acceptance.** Drag d'un Button sur une section -> ajoute un node `component` enfant avec defaults.

### Ticket S2-2 — Editeur de variants

**Effort :** 1 a 2 jours.
**Description.** Permettre de definir / editer les variants d'un composant (`primary`, `secondary`, `danger`) avec un panneau dedie. Variants exportes dans le bundle.

### Ticket S2-3 — Editeur de schemas de donnees

**Effort :** 2 a 3 jours.
**Description.** Permettre de declarer un schema (User, Project, etc.) avec champs / types / validations. Schemas exportes dans `schemas/` du bundle, avec types TypeScript inferes.

### Ticket S2-4 — Editeur de design tokens

**Effort :** 1 jour.
**Description.** Editeur graphique pour les tokens couleurs, typo, spacing, radius, shadow. Exporte en CSS variables + Tailwind config.

### Ticket S2-5 — Prototype links UI

**Effort :** 1 a 2 jours.
**Description.** Sur un element selectionne, declarer "click -> goto page X". Visualisation en mode Prototype (fleches entre frames).

### Ticket S2-6 — Audits dynamiques

**Effort :** 2 a 3 jours.
**Description.** Remplacer les listes statiques par une vraie analyse du modele :

- contraste calcule sur les paires text / background ;
- touch targets verifies (min 44x44 px sur mobile-screen) ;
- formulaires sans label flagges ;
- boutons sans `aria-label` flagges.

## Sprint 3 — branchement LLM reel (3 a 4 semaines)

### Ticket S3-1 — Configuration cle API

**Effort :** 2 a 4 h.
**Description.** Panneau de parametres pour saisir la cle API (OpenAI / Anthropic / Gemini), persistee en localStorage avec masquage. Avertissement RGPD / securite explicite. Optionnellement mode Ollama local pour eviter toute fuite.

### Ticket S3-2 — Appel LLM sur prompt global

**Effort :** 1 a 2 jours.
**Description.** Quand l'utilisateur soumet un prompt global, l'appel reel au LLM produit un patch JSON sur `state.project`. Le LLM reçoit :

- le prompt utilisateur ;
- le schema attendu (forme `state.project`) ;
- le projet courant (sauf si "from scratch") ;
- contraintes (ex. ne pas toucher a tel role).

Le LLM repond avec un JSON valide qui remplace ou patche le projet.

### Ticket S3-3 — Appel LLM sur prompt local

**Effort :** 1 a 2 jours.
**Description.** Idem mais avec patch cible :

- le LLM reçoit le sous-arbre de la selection ;
- il repond avec un patch (JSON Patch RFC 6902 ou structure equivalente) ;
- application du patch sur le sous-arbre.

### Ticket S3-4 — Historique iterations + undo

**Effort :** 1 a 2 jours.
**Description.** Pile d'etats (snapshots), bouton undo / redo, limite a 50 entrees, persistee en localStorage.

## Sprint 4 — handoff productisation (3 a 4 semaines)

### Ticket S4-1 — Export Cursor-ready

**Effort :** 2 a 3 jours.
**Description.** Bundle d'export structure pour ingestion directe par Cursor / Claude Code :

- `CLAUDE.md` ou `.cursor/rules/` avec contraintes UI lock ;
- structure de fichiers calque sur l'arbo cible (Next.js App Router) ;
- README explicatif pas-a-pas.

### Ticket S4-2 — Templates par type d'application

**Effort :** 1 a 2 semaines.
**Description.** Presets reutilisables :

- SaaS dashboard (auth + sidebar + dashboard + settings) ;
- Landing page produit (hero + features + pricing + footer) ;
- Auth flow (login + signup + forgot password) ;
- E-commerce (catalogue + product + cart + checkout) — peut nourrir CYNA.

### Ticket S4-3 — Export Expo / React Native

**Effort :** 1 a 2 semaines.
**Description.** Generation d'un projet Expo a partir du meme modele, en mappant les nodes vers `react-native` / `expo-router`.

### Ticket S4-4 — Templates Meta Quest 2D panel

**Effort :** 1 semaine.
**Description.** Generer un canvas Unity world-space avec un mapping des nodes vers UI Toolkit ou UGUI. Adapter les tailles de touch targets et les distances de lecture.

## Backlog technique (tout sprint)

- ajouter Playwright + 5 tests d'usage critiques ;
- ajouter ESLint + Prettier + tsconfig minimal (le projet n'a pas de package.json a ce jour) ;
- typer le modele JSON (TypeScript ou JSDoc) pour aider l'auto-completion ;
- decouper `app.js` en modules ES (devices, modes, render, prompts, exports) ;
- isoler le rendu pour permettre une migration future vers Preact ou Solid ;
- mesurer la performance sur projets > 200 noeuds, optimiser le re-render si necessaire ;
- audit a11y de UXai lui-meme (ironie certaine de produire un outil a11y mal accessible).

## KPI a suivre

- nombre de noeuds maximum supporte sans lag (cible 500) ;
- temps moyen de generation par prompt global (cible < 5 s avec LLM) ;
- taux d'export reutilisable sans modification manuelle (cible 80 %) ;
- nombre de variants par composant supporte (cible 5+) ;
- couverture audits dynamiques (cible 10 controles a11y, 5 perf, 5 securite).

## Risques techniques

| Risque | Probabilite | Impact | Mitigation |
|---|---|---|---|
| Modele evolue, sauvegardes anciennes plantent | Eleve | Moyen | Migration helper (S1-3). |
| Export React generique, peu utile au LLM | Moyen | Eleve | Iterer sur la qualite (S1-4 puis ameliorations). |
| LLM repond du JSON invalide | Eleve | Moyen | Validation + retry + fallback heuristique. |
| LLM consomme trop de tokens | Moyen | Moyen | Compresser le contexte, n'envoyer que la selection. |
| Fuite de donnees produit via API LLM | Faible | Eleve | Mode Ollama local, anonymisation des copies, opt-in explicite. |
| Couplage DOM / modele rend la migration framework couteuse | Moyen | Moyen | Decouper progressivement le rendu. |

## Conclusion

Le prototype est solide. Les blocages principaux pour passer en pre-production sont :

1. **Exports reels** (React / Tailwind) — la promesse "front fige" ne peut pas etre tenue avec un export Markdown seul.
2. **Application builder editeur** — la promesse "construire une app" reste partielle si l'utilisateur ne peut pas declarer ses routes / schemas.
3. **LLM reel** — la promesse "iteration IA" est aujourd'hui une heuristique locale. Au moins un branchement OpenAI / Anthropic est necessaire pour valider l'experience.

Ces trois axes constituent le coeur des sprints 1-3. Les sprints 4 et au-dela traitent l'extension a d'autres surfaces (Expo, Meta Quest) et la productisation (templates, Cursor-ready).

---

*Document a relire et a decouper en tickets dans Trello / Linear avant attaque.*
