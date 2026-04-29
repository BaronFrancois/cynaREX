# UXai - Cahier des charges fonctionnel

## 1. Vision produit

UXai est un outil no-code de conception UI/UX permettant de creer une interface stable, configurable et documentee avant de transmettre le projet a un LLM developpeur.

La promesse centrale est de figer le front comme un contrat visuel, puis de donner au LLM final un bundle complet pour implementer la logique applicative sans redesigner l'interface.

UXai s'inspire des meilleurs usages de Figma, mais avec une difference forte : chaque decision visuelle, fonctionnelle et technique doit pouvoir etre convertie en contexte exploitable par un LLM.

## 2. Objectifs

- Generer une premiere UI depuis un prompt.
- Iterer localement sur un bloc selectionne.
- Editer manuellement chaque element de l'interface.
- Organiser le projet en pages, frames, sections, composants et calques.
- Construire progressivement une application, pas seulement une maquette.
- Declarer routes, actions, donnees, etats, permissions et validations.
- Auditer accessibilite, performance et securite avant l'implementation.
- Exporter code UI, spec produit, modele JSON et garde-fous LLM.

## 3. Utilisateurs cibles

### Non technique

L'utilisateur pense en pages, blocs, textes, boutons, parcours et regles simples.

Il doit pouvoir dire :

- "ce bouton ouvre cette page" ;
- "ce formulaire cree un compte" ;
- "ce contenu est visible seulement pour les admins" ;
- "sur mobile, cette navigation devient un menu" ;
- "je veux une version plus accessible pour mauvaise vue".

### Designer / product builder

L'utilisateur veut controler :

- layout ;
- hierarchie visuelle ;
- styles ;
- responsive ;
- composants reutilisables ;
- variantes ;
- prototypes de navigation ;
- etats UI.

### LLM developpeur

Le LLM final doit recevoir :

- une UI verrouillee ;
- une structure de composants claire ;
- une spec fonctionnelle ;
- une spec technique ;
- des contraintes de securite ;
- les points de branchement logique ;
- les interdictions explicites de modification visuelle.

## 4. Fonctionnalites inspirees de Figma

### Pages et frames

UXai doit permettre de structurer le projet en pages, frames et surfaces.

Exemples :

- Landing page ;
- Dashboard ;
- Auth flow ;
- Mobile app ;
- Tablet layout ;
- Meta Quest 2D panel ;
- Etat vide ;
- Etat erreur ;
- Etat loading.

Chaque frame doit porter des informations utiles au LLM :

- route cible ;
- surface ;
- breakpoint ;
- intention produit ;
- contraintes responsive ;
- etats supportes.

### Calques et hierarchie

Les calques doivent rester au coeur de l'edition.

Attendus :

- arbre repliable ;
- double clic pour entrer dans la hierarchie ;
- drag/drop pour reordonner ;
- drag/drop pour changer de parent ;
- verrouillage d'element ;
- masquage d'element ;
- indication de role : header, nav, card, form, CTA, modal ;
- selection parent/enfant rapide.

### Composants reutilisables

UXai doit proposer une bibliotheque de composants.

Exemples :

- button ;
- input ;
- card ;
- navbar ;
- modal ;
- drawer ;
- table ;
- pricing card ;
- dashboard stat ;
- auth form ;
- command palette.

Chaque composant doit pouvoir avoir :

- props ;
- variantes ;
- etats ;
- slots ;
- role accessibility ;
- points de branchement logique.

### Variants et etats

UXai doit gerer les variantes comme Figma, mais avec une traduction technique directe.

Exemples :

- Button / primary / secondary / danger ;
- Input / default / focus / error / disabled ;
- Card / default / selected / loading ;
- Nav / desktop / mobile / drawer ;
- Table / loading / empty / populated.

Ces variantes doivent etre exportees dans les docs et dans `uxai.project.json`.

### Auto layout et contraintes

L'edition doit privilegier des layouts web propres.

Attendus :

- flex row/column ;
- grid ;
- gap ;
- padding ;
- alignement ;
- wrap ;
- min/max width ;
- contraintes responsive ;
- hug/fill/fixed ;
- reorder structurel.

Le placement absolu doit rester possible pour :

- decorations ;
- badges ;
- overlays ;
- mockups ;
- elements flottants.

### Styles et design tokens

UXai doit permettre de creer des tokens reutilisables.

Tokens minimum :

- couleurs ;
- typographies ;
- radius ;
- shadows ;
- blur ;
- spacing ;
- z-index ;
- animations ;
- breakpoints.

Les styles doivent etre exportables comme :

- CSS variables ;
- Tailwind config ;
- theme JSON ;
- documentation lisible par un LLM.

### Outils canvas

UXai doit proposer des outils de manipulation proches d'un editeur design.

Outils attendus :

- move ;
- select ;
- hand/pan ;
- zoom ;
- recenter ;
- resize ;
- frame ;
- text ;
- component ;
- comment ;
- prototype link ;
- inspect.

### Toolbar contextuelle

Au clic sur un element, une barre contextuelle doit apparaitre pres de la selection.

Elle doit permettre :

- prompt local ;
- modification texte rapide ;
- changement de parent ;
- drag ;
- duplication ;
- verrouillage ;
- masquage ;
- convertir en composant ;
- reduire la toolbar ;
- detacher et deplacer la toolbar ;
- ancrer la toolbar a nouveau.

### Prototype et liens entre pages

UXai doit permettre de declarer des interactions simples :

- go to page ;
- open modal ;
- close modal ;
- toggle menu ;
- submit form ;
- filter list ;
- change tab ;
- show toast.

Chaque interaction doit etre lisible par un non technicien et exportee techniquement comme action, handler ou route.

### Commentaires et annotations

UXai doit permettre d'ajouter des commentaires sur :

- une page ;
- un composant ;
- un etat ;
- une decision de design ;
- un risque technique ;
- une question pour le LLM final.

Ces commentaires doivent etre exportes dans la spec.

### Inspect / dev mode

UXai doit inclure un mode inspect pour preparer l'implementation.

Il doit afficher :

- nom du composant ;
- role ;
- props ;
- styles ;
- tokens utilises ;
- interactions ;
- etats ;
- contraintes LLM ;
- code cible ;
- chemins de fichiers recommandes.

## 5. Fonctionnalites propres a UXai

### Prompt global

Le prompt global genere ou transforme une page complete.

Il doit prendre en compte :

- style global ;
- cible technique ;
- audience ;
- accessibilite ;
- device ;
- type d'application ;
- contraintes de securite ;
- objectif produit.

### Prompt local

Le prompt local agit uniquement sur l'element selectionne et ses enfants.

Il doit produire un patch cible, pas une regeneration complete.

### UI lock contract

UXai doit exporter un contrat de verrouillage du front.

Le LLM final ne doit pas modifier :

- layout ;
- couleurs ;
- typo ;
- espacements ;
- animations ;
- composants visuels ;
- attributs d'accessibilite.

### Application builder

UXai doit permettre de configurer la logique attendue avant l'etape LLM.

Modules attendus :

- routes ;
- formulaires ;
- schemas de donnees ;
- actions utilisateur ;
- permissions ;
- etats de chargement ;
- etats erreur ;
- etats vides ;
- notifications ;
- integrations API ;
- stockage ;
- authentification.

### Audits

UXai doit proposer des audits generes depuis le modele.

Accessibilite :

- contraste ;
- focus ;
- navigation clavier ;
- touch targets ;
- dyslexie ;
- mauvaise vue ;
- safe areas.

Performance :

- images ;
- lazy loading ;
- animations ;
- DOM ;
- responsive ;
- recommandations Lighthouse.

Securite :

- auth ;
- roles ;
- donnees sensibles ;
- XSS ;
- injection ;
- upload ;
- rate limiting ;
- stockage client ;
- secrets.

## 6. Export attendu

Le bundle cible :

```txt
uxai-export/
├─ src/
│  ├─ components/
│  │  ├─ view/
│  │  └─ logic/
│  ├─ pages/
│  ├─ routes/
│  ├─ schemas/
│  └─ styles/
├─ docs/
│  ├─ PRODUCT_OVERVIEW.md
│  ├─ USER_FLOWS.md
│  ├─ FEATURES.md
│  ├─ IMPLEMENTATION_GUIDE.md
│  ├─ UI_LOCK_CONTRACT.md
│  ├─ ACCESSIBILITY_REPORT.md
│  ├─ PERFORMANCE_NOTES.md
│  ├─ SECURITY_NOTES.md
│  └─ TARGET_PLATFORM.md
└─ uxai.project.json
```

## 7. Priorites MVP

### MVP 1

- pages et frames ;
- calques repliables ;
- prompt global ;
- prompt local ;
- selection profonde ;
- toolbar contextuelle ;
- proprietes CSS ;
- devices ;
- audits de base ;
- export spec.

### MVP 2

- composants reutilisables ;
- variants ;
- design tokens ;
- prototype links ;
- comments ;
- application builder ;
- routes ;
- forms ;
- data schemas.

### MVP 3

- integration LLM reelle ;
- patchs JSON ;
- export React/Tailwind ;
- persistence locale ;
- import/export projet ;
- version history ;
- inspect mode avance ;
- handoff Cursor-ready.

## 8. Criteres d'acceptation

- Un utilisateur peut generer une UI puis modifier un bloc localement sans casser le reste.
- Un utilisateur peut entrer dans la hierarchie et selectionner les sous-elements.
- Un utilisateur peut modifier texte, style, shadow, border, blur, layout et responsive.
- Un utilisateur peut declarer des liens entre pages et actions simples.
- Un utilisateur peut documenter les donnees et etats attendus.
- L'export explique clairement au LLM final ce qu'il peut modifier et ce qu'il ne doit pas modifier.
- Le front reste stable pendant la phase d'implementation logique.
