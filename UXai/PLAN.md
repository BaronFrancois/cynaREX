# UXai - Plan de conception

## Vision

UXai est un outil no-code de conception d'interfaces "LLM-ready".

L'objectif n'est pas seulement de generer une UI, mais de produire une base front stable, editable et documentee, que l'on peut ensuite transmettre a un LLM pour implementer la logique applicative sans modifier le design.

Flux principal :

1. L'utilisateur decrit une interface en langage naturel.
2. UXai genere une premiere version structuree : pages, sections, composants, styles, contenus.
3. L'utilisateur selectionne une partie de l'UI et re-itere localement avec un prompt contextuel.
4. L'utilisateur ajuste les details a la main : layout, couleurs, typo, ombres, blur, responsive, animations simples.
5. UXai exporte un bundle : code UI, modele JSON, spec produit, garde-fous LLM, audits.
6. Le bundle est donne a un LLM developpeur pour brancher la logique sans faire bouger le front.

## Promesse centrale

Le front doit devenir un contrat visuel.

Le LLM final doit ajouter :

- etat applicatif ;
- routing ;
- appels API ;
- validation ;
- authentification ;
- permissions ;
- logique metier ;
- persistance.

Il ne doit pas redefinir :

- layout ;
- couleurs ;
- typographies ;
- espacements ;
- hierarchie visuelle ;
- animations ;
- composants visuels verrouilles.

## Architecture mentale

UXai doit parler deux langages :

- langage non technique : pages, blocs, boutons, actions, parcours, regles ;
- langage technique : composants, props, routes, schemas, etats, handlers, contraintes.

Objets principaux :

- Projet ;
- Surfaces ;
- Pages ;
- Sections ;
- Composants ;
- Calques ;
- Interactions ;
- Donnees ;
- Etats UI ;
- Responsive ;
- Accessibilite ;
- Performance ;
- Securite ;
- Handoff LLM.

## Construction d'applications

UXai ne doit pas rester limite a la conception d'ecrans isoles.

La cible produit est de pouvoir construire la base d'une application complete avant le passage final au LLM developpeur :

- pages et routes ;
- navigation entre pages ;
- layouts applicatifs ;
- composants reutilisables ;
- formulaires ;
- tableaux ;
- modales et drawers ;
- etats loading, empty, error, success ;
- roles et permissions ;
- contrats de donnees ;
- actions utilisateur ;
- regles metier simples ;
- specs API attendues.

Pour un utilisateur non technique, cela doit rester exprime comme :

- "quand on clique ici, on va vers cette page" ;
- "ce formulaire cree un compte" ;
- "ce bouton est visible seulement pour les admins" ;
- "cette liste affiche des projets" ;
- "si la liste est vide, afficher ce message".

Pour le LLM final, le meme contenu doit etre exporte sous forme de routes, composants, schemas, handlers et contraintes d'implementation.

Le front reste verrouille, mais l'application est deja configuree au maximum dans UXai avant l'etape LLM.

## Modele interne

Le code ne doit pas etre la source de verite.

La source de verite doit etre un modele JSON interne :

```json
{
  "project": {
    "name": "SaaS billing dashboard",
    "targetPlatform": {
      "type": "web",
      "framework": "react-tailwind"
    }
  },
  "surfaces": [
    {
      "id": "surface_web",
      "type": "web-page",
      "breakpoints": ["mobile", "tablet", "desktop"]
    }
  ],
  "pages": [
    {
      "id": "home",
      "name": "Accueil",
      "route": "/",
      "children": ["header", "hero", "features", "footer"]
    }
  ],
  "nodes": {
    "header": {
      "type": "section",
      "role": "header",
      "name": "Header principal",
      "children": ["logo", "nav", "cta"],
      "styles": {},
      "interactions": []
    }
  }
}
```

Le rendu, le code exporte, les audits et les fichiers Markdown sont generes depuis ce modele.

## Iteration IA

UXai doit permettre deux niveaux de prompt :

- prompt global : regenerer ou transformer une page complete ;
- prompt local : transformer uniquement l'element selectionne et ses enfants.

Exemples :

- selection du header : "rends-le plus premium et plus compact" ;
- selection de la nav : "remplace les liens par Produit, Tarifs, Ressources" ;
- selection d'une card : "donne-lui un style plus glassmorphism" ;
- selection d'un formulaire : "ajoute des etats erreur et chargement".

Chaque prompt local doit produire un patch cible, jamais une regeneration aveugle de toute la page.

## Edition manuelle

Panneaux simples a prevoir :

- Layout : direction, alignement, gap, padding, width, height ;
- Style : background, color, border, radius, shadow, backdrop blur ;
- Texte : font, size, weight, line-height, alignment ;
- Position : ordre, parent, z-index si necessaire ;
- Animation : presets simples, duree, delay, easing, trigger ;
- Responsive : overrides par breakpoint ;
- Interactions : click, open modal, route, toggle, submit.

## Drag and drop

Le drag and drop doit modifier le modele UI, pas seulement des coordonnees.

Deux modes doivent coexister :

- placement structurel : reordonner ou changer de parent dans des containers flex/grid ;
- placement libre : utile pour decorations, badges, overlays, mockups.

Les zones de drop doivent indiquer l'intention :

- entre deux elements : reordonner ;
- dans un container : ajouter comme enfant ;
- sur une zone vide : creer une section ou wrapper ;
- en superposition : passer en overlay ou z-index ;
- dans un autre bloc : changer de parent.

## Responsive et devices

UXai doit distinguer :

- breakpoints : logique de code exportee ;
- devices : profils de preview et d'audit.

Breakpoints MVP :

- mobile ;
- tablet ;
- desktop.

Devices MVP :

- iPhone Dynamic Island ;
- Samsung Galaxy ;
- Google Pixel ;
- iPad ;
- Desktop 1440.

Options a prevoir :

- orientation portrait/paysage ;
- safe areas ;
- zones systeme ;
- custom device ;
- alertes d'overflow et de touch targets.

## Cibles futures

Le modele doit prevoir plusieurs surfaces :

- web-page ;
- mobile-screen ;
- tablet-screen ;
- desktop-app ;
- spatial-2d-panel.

Meta Quest peut etre aborde comme une UI 2D spatiale :

- panneaux 2D ;
- menus ;
- dashboards ;
- interactions controller, hand tracking, gaze ;
- grandes tailles de texte ;
- focus visible ;
- distances de lecture ;
- recommandations Unity Canvas World Space.

## Audits

UXai doit generer des rapports depuis le modele.

Accessibilite :

- contraste ;
- tailles de police ;
- focus clavier ;
- touch targets ;
- mode mauvaise vue ;
- mode dyslexie ;
- densite cognitive ;
- safe areas.

Performance :

- poids images ;
- lazy loading ;
- DOM trop dense ;
- animations couteuses ;
- recommandations proches Lighthouse ;
- exports optimisables.

Securite :

- formulaires sensibles ;
- auth ;
- roles ;
- permissions ;
- upload ;
- donnees personnelles ;
- injection ;
- XSS ;
- rate limiting ;
- exposition de secrets ;
- stockage client.

## Bundle d'export

Structure cible :

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

## MVP propose

Version 0 :

- app statique locale ;
- prompt global simule ;
- canvas avec UI exemple ;
- arbre de calques ;
- selection d'element ;
- prompt local simule ;
- panneau de proprietes simplifie ;
- changement de device ;
- audits statiques ;
- export preview : `uxai.project.json`, `UI_LOCK_CONTRACT.md`, `IMPLEMENTATION_GUIDE.md`.

Version 1 :

- vrai modele JSON complet ;
- edition manuelle plus riche ;
- drag and drop structurel ;
- multi-pages ;
- navigation entre pages ;
- responsive par breakpoint ;
- export React/Tailwind ;
- persistance locale.

Version 2 :

- integration LLM ;
- patchs cibles ;
- historiques d'iterations ;
- composants reutilisables ;
- design system presets ;
- audits plus avances ;
- export Cursor-ready.

Version 3 :

- PWA/mobile handoff ;
- React Native/Expo spec ;
- Meta Quest 2D panel spec ;
- templates Unity ;
- recherche de devices ;
- audit securite enrichi.
