# UXai — Audit de l'implementation actuelle

**Date :** 2026-05-04
**Reference CDC :** `CDC.md`
**Reference vision :** `PLAN.md`
**Auditeur :** autopilot Claude Code

---

## 1. Synthese

Le prototype actuel couvre une base solide de la **Version 0** du PLAN et plusieurs elements de la **Version 1**. Il est entierement fonctionnel sans framework, en HTML / CSS / JS vanilla. La structure est claire et la separation modele -> rendu est en place. La **Version 2** (integration LLM, patchs cibles, design system presets) et la **Version 3** (PWA, Expo, Meta Quest) restent ouvertes.

| Bloc CDC | Couverture | Note |
|---|---|---|
| Pages, frames, surfaces | OK | Frames declarees dans `frames`, surface par device. |
| Calques et hierarchie | OK | Arbre repliable, drag/drop, expansion par etat. |
| Composants reutilisables (bibliotheque) | Partiel | `designAssets` listes ; pas de bibliotheque drag-to-canvas. |
| Variants et etats | Partiel | Variants listes par asset ; pas d'editeur d'etats. |
| Auto layout et contraintes | Partiel | Flex / direction / gap / padding presents ; min/max width manquants. |
| Tokens design | OK | Variables CSS, exposees, exportables. |
| Outils canvas | OK | Move, zoom, recenter, resize, frame, component, comment, prototype, inspect. |
| Toolbar contextuelle | OK | Apparait sur selection, repliable, detachable. |
| Prototype links entre pages | Partiel | Modele expose ; UI declarative limitee. |
| Commentaires / annotations | Partiel | Mode comment present ; structure d'annotation embryonnaire. |
| Inspect / dev mode | OK | Mode dedicated, propsexposees, fichiers cibles. |
| Prompt global | OK (simule) | Regenere structure depuis prompt texte (heuristique locale). |
| Prompt local | OK (simule) | Patch cible sur la selection. |
| UI lock contract | OK | Genere dans l'export bundle. |
| Application builder (routes, forms, data, permissions) | Partiel | Affichage panneau ; pas d'editeur de routes / schemas reels. |
| Audits a11y / perf / securite | Partiel | Listes statiques generees ; pas d'analyse dynamique du modele. |
| Bundle d'export | OK (simule) | Genere `uxai.project.json`, contracts, guides en Markdown. |
| Persistance locale | **Ajoutee** ce jour (autopilot) | localStorage debounced 300 ms + `window.UXAi.reset()`. |
| Drag and drop structurel | Partiel | Drag basique ; pas encore de feedback visuel multi-mode. |
| Multi-pages avec navigation | Partiel | Pages declarees, mais pas de navigation reelle entre pages dans l'editeur. |
| Responsive overrides par breakpoint | Manquant | Pas d'editeur d'overrides par breakpoint. |
| Export React / Tailwind reel | Manquant | Export simule en Markdown ; pas de generation `*.tsx`. |
| Integration LLM reelle | Manquant | Heuristiques locales uniquement. |
| Persistance cloud / partage | Manquant | Hors scope MVP. |

## 2. Points forts

- **Modele JSON unique source de verite.** Le rendu, les exports et les audits sont generes depuis `state.project`. Aucune divergence DOM / modele.
- **Structure du code lisible.** Un fichier monolithique mais decoupe par sections (devices, modes, frames, assets, state, helpers, render, prompts, exports). Pas de complexite cachee.
- **Toolbar contextuelle bien pensee.** Apparait pres de la selection, peut etre detachee, deplacee, ancree a nouveau, repliee. Tres proche de l'experience Figma.
- **Modes editeur explicites.** Design / Prototype / Build / Inspect sont des modes distincts qui changent le sens de l'edition. C'est aligne avec l'intention CDC.
- **Export multi-fichier bien pense.** Le drawer d'export simule deja la structure cible (`uxai-export/`) avec docs Markdown distincts.
- **Surfaces multiples.** Le modele prevoit web-page, mobile-screen, tablet-screen, desktop-app et spatial-2d-panel. La cible Meta Quest est deja pensee.

## 3. Faiblesses et dettes

### 3.1 Bibliotheque de composants statique

`designAssets` liste des composants mais ne propose pas de glisser-deposer dans le canvas. Un utilisateur ne peut pas ajouter un Button ou une Card dans une section existante.

**Impact :** la promesse "construction d'application" du PLAN reste partielle.

### 3.2 Application builder limite

Le panneau Application builder affiche routes / forms / data / permissions, mais en lecture seule. L'utilisateur ne peut pas declarer une nouvelle route ou un nouveau schema depuis l'UI.

**Impact :** la sortie LLM ne contient que des elements pre-cables.

### 3.3 Export non execute

L'export genere du Markdown et du JSON, mais ne produit pas de code React / Tailwind reel. Un LLM developpeur recevant ce bundle doit re-implementer les composants ; la promesse "front fige" perd en valeur.

**Impact :** perte de fidelite entre la maquette et le code livre.

### 3.4 Pas d'historique / undo

Aucune gestion de l'historique. Un prompt local applique a tort ne peut pas etre annule.

**Impact :** UX exploratoire difficile.

### 3.5 Audits statiques

Les audits a11y / perf / securite sont des listes pre-redigees, pas des analyses dynamiques du modele.

**Impact :** valeur educative, valeur operationnelle limitee.

### 3.6 Pas de versioning

Le modele n'a pas de champ `version` ni de schema de migration. Une evolution future du modele cassera les sauvegardes localStorage existantes.

**Impact :** dette future ; mitigation via un champ `version` deja en place dans la sauvegarde, mais sans helper de migration.

### 3.7 Couplage DOM / modele dans certaines fonctions

Quelques fonctions (drag/drop, contextToolbar) manipulent le DOM directement. Le re-render complet n'est pas systematique. Ce couplage rend une evolution vers un framework virtuel (ex. Preact) plus couteuse.

**Impact :** dette technique modeste.

### 3.8 Tests absents

Aucun test automatise. Les heuristiques de prompt ne sont pas couvertes ; une regression sur un patch local n'est pas detectable autrement qu'a l'oeil.

**Impact :** vitesse de regression test = fragilite croissante avec la taille.

## 4. Conformite CDC point par point

### 4.1 Vision produit
- Front comme contrat visuel : **OK** (concept porte par UI lock contract).
- Bundle complet pour LLM developpeur : **OK simule**.
- Inspiration Figma : **OK**.

### 4.2 Objectifs
- Generer une UI depuis un prompt : **OK simule**.
- Iterer localement : **OK simule**.
- Editer manuellement : **OK** (proprietes panel).
- Pages / frames / sections / composants / calques : **OK**.
- Construction progressive d'application : **Partiel**.
- Declarer routes, actions, donnees, etats, permissions, validations : **Partiel**.
- Auditer a11y / perf / securite : **Partiel**.
- Exporter UI / spec / JSON / garde-fous LLM : **OK**.

### 4.3 Utilisateurs cibles
- Non technique : **OK** sur la lecture, **partiel** sur l'edition (necessite encore du vocabulaire technique dans le panel proprietes).
- Designer / product builder : **OK**.
- LLM developpeur : **OK simule** (le bundle existe meme si simplifie).

### 4.4 Fonctionnalites Figma
- Pages et frames : OK.
- Calques et hierarchie : OK.
- Composants reutilisables : Partiel (bibliotheque listee, pas glissable).
- Variants et etats : Partiel.
- Auto layout : Partiel.
- Styles et tokens : OK.
- Outils canvas : OK.
- Toolbar contextuelle : OK.
- Prototype et liens entre pages : Partiel.
- Commentaires : Partiel.
- Inspect / dev mode : OK.

### 4.5 Fonctionnalites propres UXai
- Prompt global : OK simule.
- Prompt local : OK simule.
- UI lock contract : OK.
- Application builder : Partiel.
- Audits : Partiel.

### 4.6 Export attendu
- Structure `uxai-export/` : **OK simule**.
- `uxai.project.json` : **OK**.
- Docs Markdown (`PRODUCT_OVERVIEW`, `USER_FLOWS`, `IMPLEMENTATION_GUIDE`, `UI_LOCK_CONTRACT`, `ACCESSIBILITY_REPORT`, `PERFORMANCE_NOTES`, `SECURITY_NOTES`, `TARGET_PLATFORM`) : **OK partiellement, contenu generique**.
- Code React / Tailwind reel : **Manquant**.

### 4.7 MVP 1
- Pages et frames : **OK**.
- Calques repliables : **OK**.
- Prompt global : **OK**.
- Prompt local : **OK**.
- Selection profonde : **OK**.
- Toolbar contextuelle : **OK**.
- Proprietes CSS : **OK**.
- Devices : **OK**.
- Audits de base : **OK statiques**.
- Export spec : **OK**.

**Verdict MVP 1 : atteint.** Quelques perfectionnements (audits dynamiques, edition CSS plus riche) restent ouverts mais l'objectif fonctionnel est tenu.

### 4.8 MVP 2
- Composants reutilisables (drag) : **Manquant**.
- Variants : **Partiel**.
- Design tokens (editeur) : **Partiel**.
- Prototype links : **Partiel**.
- Comments : **Partiel**.
- Application builder (editeur reel) : **Partiel**.
- Routes : **Partiel**.
- Forms : **Partiel**.
- Data schemas : **Manquant**.

**Verdict MVP 2 : en cours.** Plusieurs blocs presents en lecture, edition limitee.

### 4.9 MVP 3
- Integration LLM reelle : **Manquant**.
- Patchs JSON : **Manquant**.
- Export React / Tailwind : **Manquant**.
- Persistence locale : **OK** (ajoutee ce jour).
- Import / export projet : **Partiel** (export simule, pas d'import).
- Version history : **Manquant**.
- Inspect mode avance : **OK**.
- Handoff Cursor-ready : **Manquant**.

**Verdict MVP 3 : non aborde sauf persistance.**

## 5. Bugs et points d'attention

| ID | Composant | Description | Severite |
|---|---|---|---|
| U-001 | persistance | si le modele evolue (nouveau champ obligatoire), une sauvegarde ancienne plante au load. Mitigation : champ `version` present, migration absente. | moyen |
| U-002 | drag/drop | pas de feedback visuel des zones de drop selon l'intention CDC (entre / dans / overlay / changer parent). | mineur |
| U-003 | export | les fichiers Markdown generes ont du contenu generique ; un LLM final aura peu d'information specifique au projet. | moyen |
| U-004 | i18n | UI 100 % francais, sans mecanisme i18n. | mineur |
| U-005 | accessibilite | les tab-order et roles ARIA ne sont pas systematiques sur les panneaux. | moyen |
| U-006 | render | un re-render complet a chaque changement -> couteux sur projets de plus de 200 noeuds. | moyen (futur) |
| U-007 | tests | aucun test automatise, ni meme un cas d'usage scripte (Playwright). | important |

## 6. Recommandations

### 6.1 Priorite immediate

- ajouter un bouton Reset visible (UI), au-dela de `window.UXAi.reset()` console ;
- mecanisme de migration `version` -> `version+1` sur le payload localStorage ;
- import de bundle (lecture inverse de l'export) pour boucler le cycle ;
- export reel React / Tailwind d'au moins la page principale (faire matcher le bundle de la promesse).

### 6.2 Court terme (sprint suivant)

- bibliotheque de composants drag-to-canvas ;
- editeur de variants et d'etats par composant ;
- editeur de routes dans Application builder ;
- editeur de schemas de donnees minimaliste ;
- audits dynamiques (lire le modele et flagger les violations reelles).

### 6.3 Moyen terme

- integration LLM reelle (au choix : OpenAI, Anthropic, Gemini local, Ollama) ;
- historique d'iterations + undo / redo ;
- patchs JSON cibles avec verification ;
- responsive overrides par breakpoint dans le panel proprietes.

### 6.4 Long terme

- Cursor-ready handoff (specifications structurees pour Cursor / Claude Code) ;
- presets design system (Tailwind UI, Shadcn UI, Radix UI) ;
- export Expo / React Native depuis le meme modele ;
- presets Meta Quest 2D panel.

## 7. Verdict global

Le prototype atteint la promesse Version 0 / 1 du PLAN avec une qualite tres correcte pour un effort solo. La structure est saine, la philosophie "modele unique" est respectee, et la majorite des fonctions Figma-like sont presentes au niveau UI. Les **prochaines etapes naturelles** sont :

1. boucler la persistance avec un import (la sauvegarde locale est faite ce jour) ;
2. boucler l'export avec un veritable code React / Tailwind genere ;
3. transformer Application builder d'un panneau lecture en editeur ;
4. brancher un LLM reel pour les prompts.

Une fois ces quatre etapes franchies, UXai passe d'un "demonstrateur d'idee" a un "outil utilisable en pre-production".

---

*Document genere automatiquement. A relire a tete reposee, et a re-decouper en tickets avant attaque.*
