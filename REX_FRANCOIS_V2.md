# REX — Retour d'Expérience Projet CYNA

**Nom :** Baron  
**Prénom :** François  
**Formation :** CPI DEV — Chef de Projet Informatique  
**Projet :** Plateforme e-commerce CYNA (BC2 / BC3)  
**Équipe :** Jessica, Emmanuel, Théo, François  
**Période :** 25 septembre 2025 — 27 mai 2026  
**Jalons :** cadrage initial (6 février 2026), rendu BC2 / REX (22 avril 2026), rendu BC3 / DAT (27 mai 2026)

---

## Sommaire

*Sommaire auto-généré à la conversion Word.*

---

## Introduction

Ce document est mon retour d'expérience personnel sur le projet CYNA, plateforme e-commerce développée dans le cadre de la formation CPI DEV. Le projet visait à livrer une vitrine en ligne pour CYNA, entreprise spécialisée en cybersécurité, autour de trois familles de services : SOC (*Security Operations Center*), EDR (*Endpoint Detection & Response*) et XDR (*Extended Detection & Response*). La solution finale s'appuie sur une vitrine Next.js, une API NestJS, une base PostgreSQL gérée par Prisma, une intégration Stripe et une application mobile Expo.

Ce REX décrit ce que j'ai fait, ce que j'ai appris, et ce que j'aurais aimé faire autrement. J'y mets ma voix, mon ressenti et mes hésitations, parce que c'est la consigne du document : un retour personnel, pas une description objective de l'équipe. Quand quelque chose n'a pas fonctionné comme prévu — ce qui a été le cas plusieurs fois — je le dis. Quand quelque chose a été inattendu et instructif — il y en a eu plusieurs aussi — je le dis également.

---

## 1. Présentation de mon rôle

Mon rôle dans le projet CYNA s'est construit en deux temps. La première partie a été celle d'un **développeur frontend** (avec une casquette de maquettiste-concepteur en amont) sur la vitrine `cyna-vitrine` en Next.js, React et TypeScript. La seconde, en fin de projet, a été celle d'un **contributeur à la stabilisation de la démo de soutenance**.

### 1.1 Périmètre principal : conception et développement de la vitrine

Au moment de la création du groupe, nous avons convenu d'une répartition des rôles. La mienne était claire : prendre en main la **dimension visuelle et l'expérience utilisateur** du site, depuis la maquette Figma jusqu'à l'implémentation du frontend en Next.js. Concrètement, mon périmètre couvrait :

- la **conception de la maquette** sur Figma, en partant du cahier des charges et en m'inspirant de sites que j'apprécie et que je trouve efficaces — Apple et DJI principalement, pour leur clarté visuelle et leur hiérarchie d'information ;
- l'**implémentation des écrans publics et utilisateur** : accueil, catalogue, fiche produit, recherche, panier, checkout, espace compte, contact, support, SAV, ainsi que les pages légales (CGU, mentions légales) ;
- la **construction des composants partagés** qui donnent à la vitrine son identité : header, footer, logo CYNA, switcher de langue, fallbacks de chargement, blocs spécifiques au domaine cyber (flux d'actualités, *threat feed*) ;
- l'**intégration avec l'API NestJS** côté client : couche de services, hooks personnalisés, types TypeScript alignés sur la forme des réponses API, gestion d'erreurs côté navigateur.

Ce périmètre correspond à ce que je sais faire et à ce que j'ai voulu prendre en charge. Le reste de l'équipe — Jessica, Emmanuel et Théo — a porté les autres briques : API et base de données, authentification, paiement côté serveur, application mobile.

### 1.2 Évolution en fin de projet : la démo de secours

À l'approche de la soutenance, la chaîne complète (vitrine + API + base + paiement) est devenue instable, sans qu'un seul élément en soit la cause directe. C'est plutôt l'accumulation : intégrations tardives, variables d'environnement non synchronisées entre les postes de l'équipe, dépendances qui n'étaient pas toujours alignées d'une machine à l'autre, parcours testés isolément mais pas systématiquement de bout en bout.

Mon rôle s'est alors étendu. Il fallait disposer d'une version maîtrisée et démontrable, et je connaissais le mieux la partie vitrine. J'ai donc contribué à la préparation d'une **démo de secours**, en relançant proprement le frontend dans un environnement contrôlé, avec un parcours minimal validé — accueil, catalogue, fiche produit, panier, checkout en mode test Stripe — et une cohérence visuelle préservée.

Ce rôle n'était pas écrit au départ. Il s'est imposé par la pression du calendrier. C'est probablement l'apprentissage le plus utile sur le plan professionnel : un projet n'a de valeur en soutenance que s'il peut être **lancé, montré, expliqué**, et cette capacité doit être anticipée, pas improvisée trois jours avant l'oral.

---

## 2. Travail réalisé

Mon travail s'est organisé en plusieurs phases, depuis la conception visuelle jusqu'à la stabilisation de la démo. Je décris ici les contributions concrètes, en gardant en tête que certaines parties — notamment l'apprentissage de Tailwind ou de Stripe — sont reprises plus en détail dans la section *Difficultés rencontrées*.

### 2.1 Conception : maquette Figma

La phase initiale a été celle de la maquette. J'ai construit l'arborescence et les écrans clés sur Figma, en partant du cahier des charges et en m'inspirant de sites que je trouve efficaces visuellement : **Apple** pour la sobriété et la hiérarchie typographique, **DJI** pour la mise en valeur produit dans un univers technique. L'enjeu côté CYNA était particulier : il fallait tenir une identité crédible pour une entreprise de cybersécurité, pas une vitrine e-commerce générique. Un site qui vend du SOC ou de l'EDR n'a pas la même posture qu'un site qui vend des t-shirts.

Cette phase de maquette a aussi été une phase d'**arbitrage continu** entre le cahier des charges initial et la vision qui évoluait au fil des retours de l'équipe et des échanges avec le formateur. Je jonglais en permanence entre ces deux références : ce que demandait le cadrage écrit, et ce qui paraissait juste à mesure que le projet prenait forme. Certaines décisions ont été prises sur Figma puis remises en question quand j'ai commencé à les implémenter en code.

J'ai également dû intégrer des **conventions UX que je ne connaissais pas**. Le cas le plus marquant a été le **menu hamburger** sur mobile. Je n'avais pas conçu de menu de ce type et ma première proposition ne l'incluait pas. L'équipe m'a fait le retour que c'était devenu un standard implicite. Plutôt que de reproduire la convention sans réfléchir, j'ai écouté le retour, compris le pourquoi — densité d'information sur petit écran, attente utilisateur — puis je l'ai intégrée à ma manière, en gardant la cohérence visuelle de la vitrine. Cette manière de faire (comprendre la convention avant de la reprendre) est revenue plusieurs fois pendant le projet.

### 2.2 Implémentation de la vitrine `cyna-vitrine`

La vitrine a été développée en **Next.js 16 / React 19 / TypeScript 5**, avec **Tailwind CSS 4** pour le style. La stack a été choisie collectivement par l'équipe ; mon travail a été de concrétiser la maquette dans cette stack et de livrer un parcours utilisateur cohérent.

**Pages développées :**

| Route | Rôle |
|---|---|
| `/` (accueil) | Présentation de l'offre, blocs catégories SOC/EDR/XDR, mise en avant produits |
| `/catalog` | Catalogue avec filtres par catégorie |
| `/product/[slug]` | Fiche produit détaillée |
| `/search` | Recherche dans le catalogue (composant `AppSearch`) |
| `/cart` | Panier utilisateur |
| `/checkout` | Tunnel de paiement (Stripe Elements) |
| `/account` | Espace utilisateur (commandes, abonnements, adresses) |
| `/contact`, `/support`, `/sav` | Pages contact, support, service après-vente |
| `/auth/*`, `/forgot-password` | Authentification, récupération de mot de passe |
| `/cgu`, `/mentions-legales` | Pages légales |

**Priorité affichée tout au long :** la **simplicité d'usage**. Si le site n'est pas immédiatement clair pour l'utilisateur, le reste perd de la valeur. Cette priorité a guidé plusieurs décisions sur l'architecture des pages, la hiérarchie des informations, les états de chargement (`CatalogSuspenseFallback`) et la gestion des erreurs.

### 2.3 Composants partagés et identité visuelle

Au-delà des pages, j'ai construit la **bibliothèque de composants partagés** qui donne à la vitrine sa cohérence visuelle :

- `AppHeader` et `AppFooter` — structure du *shell*, navigation principale ;
- `CynaLogo` — logo CYNA en SVG, dégradé violet/magenta cohérent avec l'identité ;
- `AppSearch` — composant de recherche réutilisable, avec liens rapides vers les pages clés ;
- `LanguageSwitcher` — bascule FR/EN (l'i18n est intégrée côté composants, en gardant la structure compatible avec une extension à plusieurs langues) ;
- `CatalogSuspenseFallback` — état de chargement pendant la récupération du catalogue ;
- `CyberNewsFeed` et `ThreatFeed` — blocs spécifiques au monde cyber, pour donner à la vitrine un ancrage thématique (flux d'actualités et indicateurs de menaces, *mockés* dans la version actuelle) ;
- `LegalPageShell` — gabarit commun pour les pages légales ;
- `Providers` — orchestration des contextes React (i18n, thème, etc.).

Le projet utilise un **thème sombre forcé** (`forcedTheme="dark"`), choix cohérent avec l'identité d'une plateforme cybersécurité. Les variables CSS d'identité (couleurs `--cyna-*`, dégradés) sont centralisées dans `globals.css`.

### 2.4 Intégration avec l'API et paiement

J'ai travaillé sur l'**intégration de l'API NestJS côté client** : appels depuis les pages React, gestion des états de chargement et d'erreur, mise en place de la couche `services/` qui sert de pont entre le composant qui affiche et l'endpoint qui répond. Quand l'API évoluait, il fallait que la vitrine suive sans casser silencieusement — un changement de format de réponse côté backend pouvait rendre une page muette ou en erreur sans message clair.

J'ai aussi intégré **Stripe en mode développement** (`@stripe/react-stripe-js`, `@stripe/stripe-js`) sur le tunnel de checkout. C'était une nouveauté pour moi : je connaissais le paiement par **Verifone** dans un contexte différent, et le fonctionnement de Stripe — *PaymentIntent*, *Elements*, *webhooks* — relève d'un autre paradigme. J'y reviens plus en détail dans la section *Difficultés*.

### 2.5 Contribution à la démo de secours

À J-3 de la soutenance, l'instabilité de la chaîne complète a rendu nécessaire la préparation d'une démo de secours. J'ai contribué à cette préparation côté frontend, parce que c'était mon périmètre de connaissance. Concrètement :

- relancer la vitrine en local avec une configuration `.env` propre, validée sur un poste neutre ;
- valider un parcours minimal de bout en bout : accueil → catalogue → fiche produit → ajout au panier → checkout en mode test Stripe ;
- vérifier la cohérence visuelle (responsive, *dark mode*, polices, dégradés) sur les écrans démontrés ;
- préparer un fil de présentation qui montre le maximum de valeur sans masquer les limites.

L'objectif n'était pas de remplacer le projet principal mais d'avoir un **filet** : un environnement maîtrisé, lançable depuis une machine connue, avec un parcours validé. C'est cette version de secours qui a été utilisée pendant l'oral.

---

## 3. Difficultés rencontrées

Plutôt que de lister une suite générique de problèmes, je décris ici les difficultés qui m'ont vraiment marqué pendant le projet. Certaines sont techniques (apprendre une stack que je ne maîtrisais pas), d'autres relèvent de l'organisation collective ou des outils que nous avons utilisés. Toutes m'ont appris quelque chose, mais sur le moment, plusieurs ont été franchement inconfortables.

### 3.1 Tailwind comme rupture avec mes habitudes CSS

La première difficulté que je n'avais pas anticipée a été l'**apprentissage de Tailwind CSS**. J'avais l'habitude de travailler en CSS et HTML avec des classes et des `id` bien structurés, des fichiers de style séparés, une logique nominale claire (une classe = une intention sémantique). Tailwind fonctionne autrement : tout est dans le markup, par accumulation d'utilitaires.

Mon ressenti pendant la prise en main a été ambivalent. D'un côté, **Tailwind est efficace pour générer rapidement quelque chose de standard** : un composant fonctionnel sort en quelques minutes, le rendu est propre par défaut, le responsive est immédiat avec les préfixes (`md:`, `lg:`). De l'autre côté, **dès qu'il fallait aller dans le détail**, je trouvais l'approche contraignante : pour pousser une finition précise, il fallait empiler les classes utilitaires dans un seul attribut `className`, et le code prenait pour moi une **sensation de brouillon**.

Avec du recul, je comprends que cette sensation tient surtout à mes habitudes. Tailwind a ses raisons d'exister : éviter la dette CSS, garder le style colocalisé avec le composant, faciliter les *design tokens*. Mais sur le moment, c'était une rupture inconfortable, et il m'a fallu plusieurs semaines pour produire du code dans cette stack sans avoir l'impression de **bricoler à l'opposé de mes réflexes**. Si je devais recommencer, je consacrerais explicitement les premiers jours du projet à cet apprentissage (lecture de la doc, exercices à blanc), plutôt qu'à entrer directement dans le code de production.

### 3.2 Apprentissage de Stripe en mode développement

La deuxième difficulté technique marquante a été **l'intégration de Stripe**. Je connaissais le paiement uniquement à travers **Verifone**, dans un contexte plus matériel et linéaire (terminal, transaction, validation). Stripe propose un modèle complètement différent : *PaymentIntent* côté serveur, *Elements* côté client, *webhooks* pour confirmer asynchroneement la transaction côté backend. Le tunnel de paiement n'est pas une suite d'étapes locales, c'est un dialogue entre le navigateur, l'API, le serveur Stripe et les *webhooks* de retour.

Le mode test de Stripe est très bien fait — comptes de test, cartes de test, journalisation des événements dans le *dashboard* — mais il fallait d'abord **comprendre la philosophie avant de toucher au code**. J'ai passé un temps non négligeable à lire la documentation et à comprendre pourquoi un *PaymentIntent* devait être créé côté serveur et confirmé côté client, plutôt que d'envoyer la carte directement à l'API. Une fois ce modèle assimilé, l'implémentation est devenue beaucoup plus claire.

C'est probablement la compétence technique la plus transférable que je retire du projet : Stripe est un acteur central dans l'e-commerce moderne, et en avoir vu le fonctionnement réel — pas juste la documentation — me sera utile dans tout projet futur impliquant du paiement.

### 3.3 Différences d'environnements et interfaces inconnues

Une difficulté plus diffuse mais tout aussi réelle a été l'**hétérogénéité des environnements de développement** dans l'équipe. Le projet fonctionnait chez moi, et lorsque mes collègues faisaient un `git pull`, il pouvait ne pas démarrer chez eux : versions de Node différentes, dépendances qui ne s'installaient pas pareil, variables d'environnement non synchronisées, base de données dans un état attendu sur un poste mais pas sur l'autre. Ce n'est jamais un problème dramatique pris isolément — un `npm install`, un `npm run dev`, une lecture de `.env` règlent l'essentiel — mais **multiplié par quatre postes et plusieurs semaines, ça a coûté du temps et de la patience**.

Avec du recul, je pense qu'**une solution hébergée dès le départ** (par exemple GitHub Pages pour la vitrine statique, ou un déploiement automatique sur Netlify / Vercel sur chaque commit `main`) aurait évité une grande partie de ces frictions. L'équipe aurait partagé le même environnement de test, accessible par un simple lien, et le travail local serait resté cantonné au développement actif. Ce n'est pas une révolution conceptuelle, mais ça aurait été un gain de temps réel.

À cette difficulté s'est ajoutée la **découverte d'outils que je ne connaissais pas**, en particulier `phpMyAdmin` et `pageAdmin` pour l'accès à la base de données en local. Sur le principe, ce sont des interfaces accessibles ; en pratique, je suis toujours un peu surpris de constater à quel point une interface paraît **frustrante à apprendre tant qu'on la découvre** — où est l'option, comment lancer une requête, comment interpréter une erreur affichée en bandeau rouge sans contexte. Une fois la prise en main faite, ces outils sont utiles. Mais la marche est plus haute que ce que la documentation laisse penser.

### 3.4 Outils de suivi et collaboration : GitHub, Google Slides, Teams

L'organisation collective du projet a aussi été une source de difficultés, principalement à cause des **outils choisis pour le suivi**. Nous avons utilisé **GitHub Projects** pour la partie organisation des tâches. Sur le papier, c'est cohérent : code, *issues*, *pull requests* et tâches dans le même endroit. En pratique, je l'ai trouvé **plutôt frustrant à utiliser** : interface dense, friction pour créer rapidement une carte, manque de fluidité quand on veut juste partager un objectif avec un collègue.

À titre de comparaison, **Trello** me paraît bien plus accessible et pertinent pour se fixer des objectifs clairs et intuitifs : on partage un lien et c'est réglé. La courbe de prise en main est nulle. Pour la communication continue, **Teams ou Discord** ont fonctionné correctement, dans le registre conversation et partage rapide de fichiers. Mon ressenti général est que l'**idéal aurait été un mix** : un outil structuré et lisible (type Trello) pour le suivi des tâches, et une messagerie type Teams ou Discord pour les échanges informels. GitHub Projects voulait jouer sur les deux tableaux et n'était pleinement satisfaisant ni sur l'un, ni sur l'autre.

Pour la **présentation de soutenance**, nous avons choisi **Google Slides**. C'est un outil que j'ai trouvé **particulièrement difficile à gérer** : encore une interface à comprendre, avec ses limitations (mise en page rigide, gestion des images approximative, certains effets impossibles ou cachés). Mais sur le plan collaboratif pur, je dois reconnaître qu'il est agréable : plusieurs personnes peuvent travailler simultanément, les modifications sont synchrones, l'historique est lisible. Le compromis a été acceptable à condition de faire des choix simples sur la mise en forme.

### 3.5 Instabilité de la chaîne complète à l'approche de la soutenance

La difficulté la plus visible — et la plus stressante — a été l'**instabilité de la chaîne complète** dans la dernière semaine. Je l'ai déjà évoquée plus haut, mais je veux revenir ici sur le vécu de cette phase, parce que c'est là que beaucoup d'apprentissages se sont condensés.

La vitrine seule pouvait se lancer, l'API seule pouvait répondre, mais le parcours complet (vitrine → API → base → paiement) ne tenait pas de bout en bout. Ce n'était pas un seul bug. C'était une **accumulation** : intégrations tardives qui n'avaient pas été testées en chaîne, variables d'environnement légèrement désynchronisées entre les postes, dépendances qui n'étaient pas alignées sur toutes les machines, parcours testés en isolation mais pas en intégration.

L'impact concret : sans précaution, la démonstration risquait de s'arrêter dès la première étape. La pression a été réelle, principalement parce que **toutes les tâches encore ouvertes étaient légitimes** — corriger, stabiliser, documenter, préparer la démo, finaliser les slides — mais elles ne tenaient pas dans le temps disponible. Il a fallu accepter de ne pas tout faire et choisir ce qui était indispensable pour l'oral.

Le moment qui a permis de débloquer la situation a été la **décision collective**, à quelques jours de la soutenance, d'**assumer ensemble une stratégie incluant un backup**. Personne n'a essayé de cacher la situation, personne ne s'est replié sur son périmètre individuel. Nous avons reconnu collectivement que la priorité n'était plus de tout finir, mais de **tenir l'oral avec un récit honnête**. Cette lucidité d'équipe a été la condition de tout le reste.

---

## 4. Solutions mises en place

À chaque difficulté décrite dans la section précédente correspond une réponse — parfois explicite et structurée, parfois plus implicite, faite d'ajustements progressifs. Je décris ici les solutions concrètes que j'ai mises en place, en gardant le lien avec le problème qu'elles tentaient de résoudre.

### 4.1 Apprivoiser Tailwind plutôt que le subir

Face à mon inconfort initial avec Tailwind, j'ai progressivement adopté une approche en deux temps : **utiliser les utilitaires pour la structure et les états standards** (espacements, *flex*, *grid*, responsive, couleurs de base via les variables CSS centralisées), et **isoler les éléments qui demandaient une finition précise** dans des composants React clairement nommés, où l'accumulation des classes utilitaires reste localisée et lisible. Plutôt que de combattre la philosophie de Tailwind, je me suis efforcé d'**accepter qu'il sert un objectif différent du CSS classique** — colocalisation du style et du composant, vélocité d'itération — et de l'utiliser dans son registre. Mon ressenti reste mitigé, mais j'ai cessé de le percevoir comme un obstacle.

### 4.2 Stripe : comprendre avant d'implémenter

Pour Stripe, la solution a été de **ralentir avant d'écrire du code**. J'ai pris le temps de lire la documentation officielle sur le modèle *PaymentIntent / Elements / webhooks*, de comprendre la séparation entre ce qui se passe côté client (collecte sécurisée des informations de paiement) et côté serveur (création de l'intention, confirmation, gestion des événements), avant d'attaquer l'intégration. Cette discipline — *comprendre la philosophie avant de coder* — m'a évité de passer du temps à debug du code construit sur une mauvaise compréhension du modèle. Je l'applique désormais à toute nouvelle technologie qui repose sur un paradigme inconnu.

### 4.3 Écouter les retours et adapter à ma manière

La solution récurrente face aux **conventions UX que je ne connaissais pas** a été d'écouter les retours de l'équipe, de prendre le temps de comprendre **pourquoi** une convention existe (et pas seulement *qu'*elle existe), puis de l'intégrer en gardant la cohérence de mon travail. Le menu hamburger en est l'exemple le plus net, mais cette posture s'est appliquée à plusieurs autres décisions de design. Reproduire une convention sans la comprendre produit du travail générique ; la comprendre puis la reprendre à sa manière permet de la **rendre sienne**.

### 4.4 La démo de secours comme filet pragmatique

Sur la stabilisation de l'oral, la solution n'a pas été de promettre que tout marcherait à temps. Elle a été de **construire un filet** : une démo de secours fonctionnelle, lançable depuis un poste maîtrisé, avec un parcours minimal validé. Cette posture rejoint un principe plus général : **face à un risque qu'on ne peut pas éliminer à temps, on construit un plan B**. C'est moins glorieux qu'un projet parfaitement stabilisé, mais c'est défendable en soutenance et c'est honnête vis-à-vis du jury.

J'ai aussi poussé la posture de **transparence** dans la présentation : distinguer ce qui fonctionne pleinement, ce qui est partiel et ce qui n'a pas été abordé. Une fonctionnalité partielle expliquée comme telle est plus défendable qu'une fonctionnalité présentée comme finie qui se révèle cassée à la première question. Cette posture rejoint d'ailleurs les attendus du guide REX et de la grille d'évaluation, qui valorisent explicitement la transparence.

### 4.5 Ce qu'on aurait pu mettre en place plus tôt

Plusieurs des difficultés rencontrées auraient pu être évitées par des décisions prises en début de projet. Je les liste ici comme **solutions à mettre en place dès le sprint 1** d'un projet futur, plutôt que comme des solutions effectivement appliquées sur CYNA :

- un **environnement hébergé partagé** dès le départ (GitHub Pages, Netlify, Vercel) pour aligner les postes de l'équipe sur une version testable par lien ;
- un **outil de suivi mixte** : Trello pour la lisibilité des tâches, Teams ou Discord pour la communication ;
- un **jalon « démo de bout en bout sur poste neutre »** au milieu du projet, pas en fin, pour détecter tôt les problèmes d'intégration ;
- un **temps explicite consacré aux apprentissages techniques** en début de projet, plutôt que de les disperser dans le code de production (Tailwind, Stripe, outils SQL).

Ces solutions n'ont pas été appliquées sur CYNA, mais elles font partie de ce que je retiens pour la suite.

---

## 5. Compétences acquises

Le projet CYNA m'a fait progresser à la fois sur le plan technique et sur le plan transversal. Je distingue les deux registres parce qu'ils ne se mesurent pas de la même manière : le technique se constate dans le code livré, le transversal se constate dans la manière de travailler.

### 5.1 Compétences techniques

Le tableau ci-dessous synthétise mon niveau avant et après le projet, sur les compétences techniques principales mobilisées. La colonne *Comment* explicite ce qui a permis la progression.

| Compétence | Niveau avant | Niveau après | Comment |
|---|---|---|---|
| **HTML / CSS classique** | Opérationnel (base solide) | Maintenu | Compétence de base que je conserve ; intervient en arrière-plan dans les choix de structure et de style |
| **Next.js / React 19** | Notions | Opérationnel | Implémentation complète d'une vitrine multi-pages avec App Router, Server / Client Components |
| **TypeScript en équipe** | Notions | Opérationnel | Typage des composants, des services API, des types partagés (`types/produit.ts`) |
| **Tailwind CSS 4** | Aucun | Opérationnel (avec réserves personnelles) | Apprentissage en cours de projet ; reste un outil que j'utilise sans en être pleinement convaincu |
| **Figma (maquettage)** | Notions | Opérationnel | Maquette complète de la vitrine, arbitrages visuels, itérations sur retours équipe |
| **Stripe (paiement web)** | Aucun | Opérationnel sur le modèle *PaymentIntent / Elements* | Lecture documentation, intégration tunnel checkout, test en mode dev |
| **Intégration API REST côté client** | Notions | Opérationnel | Couche `services/`, hooks personnalisés, gestion d'états et d'erreurs |
| **Internationalisation (i18n)** | Aucun | Opérationnel sur cas simples | Bascule FR/EN via `LanguageSwitcher` et `I18nProvider` |
| **Variables d'environnement, config multi-env** | Débutant | Opérationnel | `.env` propre pour la démo, distinction local/test/démo |
| **Lecture critique d'un dépôt existant** | Intermédiaire | Confirmé | Prise en main de la chaîne complète pour préparer le backup |
| **Outils SQL (phpMyAdmin, pageAdmin)** | Aucun | Opérationnel sur cas standard (avec support documentation) | Mise en place et utilisation en contexte projet ; je peux reproduire les manipulations à partir d'un tutoriel |
| **Identité visuelle / *design system* léger** | Débutant | Intermédiaire | Variables CSS d'identité, logo SVG, *dark theme* forcé |

Le saut le plus net pour moi concerne deux compétences : **Stripe**, parce que c'est une technologie centrale dans l'e-commerce moderne et que j'en ai vu le fonctionnement réel ; et **la lecture d'un projet existant**, parce que la phase de stabilisation finale m'a obligé à entrer dans un état du dépôt que je n'avais pas écrit seul, à identifier ce qui marche, ce qui plante, ce qui peut être lancé. Cette compétence a une valeur professionnelle directe : c'est exactement ce qu'on fait en arrivant sur un projet existant en entreprise.

### 5.2 Compétences transversales

Au-delà du technique, le projet m'a fait progresser sur plusieurs compétences transversales, plus difficiles à mesurer mais tout aussi importantes :

- **Adaptation aux conventions inconnues.** Apprendre à intégrer une convention (menu hamburger, *dark mode* par défaut sur un site cyber, etc.) en comprenant son pourquoi avant de la reproduire.
- **Écoute des retours équipe.** Ne pas défendre ma maquette comme un objet figé, mais accepter qu'elle évolue à partir de critiques et de suggestions, tout en gardant une cohérence d'ensemble.
- **Priorisation sous contrainte.** Choisir, dans la dernière semaine, ce qui était indispensable pour l'oral et ce qui pouvait être reporté ou expliqué comme partiel.
- **Communication des limites.** Expliquer ce qui ne marche pas sans dévaluer le travail collectif. La transparence n'est pas une faiblesse : c'est un critère d'évaluation et une posture professionnelle.
- **Conception centrée sur la simplicité.** Garder en permanence à l'esprit que la priorité utilisateur est **un site immédiatement clair**. Cette boussole a guidé plusieurs arbitrages.
- **Coordination informelle.** Faire le lien entre ce que demande le cadrage, ce qui est implémenté et ce qui peut être démontré, sans que ce rôle ait été explicitement attribué.

Je ne mets pas le mot *leadership* dans cette liste. Le terme est trop large pour ce que j'ai fait. Je suis resté dans mon périmètre frontend, avec des contributions ponctuelles à la coordination et à la stabilisation collective.

---

## 6. Travail en équipe

Le travail en équipe a été l'un des aspects les plus instructifs du projet, parce qu'il a touché à la fois à l'organisation, aux outils, aux dynamiques humaines et à ma propre place dans un collectif.

### 6.1 Composition de l'équipe et répartition des rôles

L'équipe était composée de quatre personnes :

- **Théo** : développement backend, architecture API NestJS, structure du projet, déploiement et hébergement.
- **Jessica** : développement backend, authentification, modèle de données, intégration Stripe côté serveur.
- **Emmanuel** : participation au front, tests, apprentissage progressif des outils.
- **François (moi)** : conception de la maquette, développement frontend (vitrine Next.js), composants partagés, intégration API côté client, contribution à la démo de secours.

Cette répartition est une description **ex-post** : elle reflète ce que chacun a effectivement porté, mais elle n'a pas été formalisée au sprint 1 dans un document partagé. C'est l'un des points que je retiens : un **tableau de rôles écrit en début de projet**, même imparfait, aurait évité plusieurs micro-frictions sur « qui fait quoi ».

### 6.2 Outils utilisés et ressenti par outil

Les outils utilisés et mon ressenti sur chacun :

| Outil | Usage | Mon ressenti |
|---|---|---|
| **GitHub** (code, *PR*, *issues*) | Code source, relecture, *merge* | Solide pour le code, pratique pour les *pull requests* |
| **GitHub Projects** | Suivi de tâches | Frustrant au quotidien, manque de fluidité (cf. § 3.4) |
| **Teams / Discord** | Communication continue | Correct dans le registre informel |
| **Google Slides** | Slides de soutenance | Difficile à maîtriser, mais bon en collaboratif simultané |
| **Figma** | Maquette frontend | Très bon pour l'itération visuelle et les retours |
| **Stripe Dashboard** (mode dev) | Test des paiements | Très bien fait, journalisation utile |

Mon **idéal rétrospectif** serait un mix : un outil de suivi clair et accessible (type **Trello** : on partage un lien, c'est lisible, la prise en main est immédiate) couplé à une messagerie type **Teams ou Discord** pour les échanges, plutôt que GitHub Projects qui voulait jouer sur les deux registres et n'était pleinement satisfaisant ni sur l'un, ni sur l'autre.

### 6.3 Rituels d'équipe

Nous avons travaillé en sprints courts, avec des points réguliers — pas un *standup* quotidien strict, mais des sessions de travail synchrones sur Teams ou Discord quand un blocage le justifiait, et des échanges asynchrones le reste du temps. Le rituel SCRUM était présent **dans l'esprit** (sprints, revues, rétrospectives légères), pas dans la rigueur stricte du *framework*.

Avec du recul, des rituels plus stricts auraient probablement aidé à anticiper la stabilisation finale : une *definition of done* partagée, un jalon explicite « démo de bout en bout validée », des démos intermédiaires sur poste neutre. Pas pour formaliser à outrance, mais pour **éviter qu'une intégration incomplète passe pour une intégration finie**.

### 6.4 Moment fort de collaboration

Le moment que je retiens n'est pas une livraison glorieuse. C'est la **décision collective**, à quelques jours de l'oral, d'**assumer ensemble une stratégie de présentation incluant un backup**. Personne n'a essayé de cacher la situation, personne ne s'est replié sur son périmètre. Nous avons reconnu collectivement que la priorité n'était plus de tout finir, mais de tenir l'oral avec un récit honnête. Cette lucidité d'équipe a été la condition de la suite.

C'est aussi à ce moment-là que j'ai mesuré le bénéfice du **travail collaboratif** comme posture, au-delà de l'addition de contributions individuelles. Un résultat qui est le fruit d'un travail collaboratif a une qualité différente d'un résultat construit en juxtaposition. Cette différence est difficile à formaliser, mais elle est tangible quand on la vit.

---

## 7. Bilan personnel

Le projet CYNA a été dense et exigeant, particulièrement dans sa dernière semaine. Il m'a confronté à une situation que je retrouverai en contexte professionnel : un livrable attendu, une date fixe, une chaîne technique partiellement instable, une équipe en apprentissage partagé sur plusieurs technologies en même temps, et la nécessité de présenter quelque chose de fonctionnel.

### 7.1 Ce que je me suis découvert sur ma place en équipe

Le projet m'a fait découvrir quelque chose sur **ma façon de me situer dans une équipe** que je n'avais pas formulé avant. J'ai un naturel à **vouloir trouver des solutions pour que les choses avancent**, en évitant au maximum la frustration — la mienne et celle des autres. Ce n'est pas un trait que j'ai cultivé délibérément ; c'est une posture qui s'est imposée à mesure que les difficultés concrètes apparaissaient. Quand une convention me dérangeait (le menu hamburger), je l'intégrais à ma manière plutôt que de m'opposer frontalement. Quand un environnement de développement bloquait un collègue, je cherchais comment l'aider à débloquer plutôt que de me limiter à mon poste fonctionnel. Quand la chaîne complète est devenue instable, j'ai contribué au backup parce que ma connaissance de la vitrine pouvait servir à autre chose.

J'ai aussi **apprécié l'aspect d'échange et de collaboration** comme tel. Voir un résultat qui est le fruit d'un travail collaboratif — pas l'addition de quatre travaux solitaires — produit une satisfaction d'une autre nature que la livraison d'un projet personnel. Cette satisfaction est difficile à mettre en mots, mais elle est réelle, et elle informe ma manière d'envisager la suite de mon parcours.

### 7.2 Ce que je retiens en premier sur le projet

Trois apprentissages principaux ressortent du projet, par ordre d'importance pour moi :

**Une version démontrable de bout en bout doit exister tôt et être testée régulièrement.** Construire des fonctionnalités sans vérifier régulièrement que toute la chaîne tient ensemble produit une dette qui se paie au pire moment. Si je devais recommencer, je poserais un jalon « version démontrable validée sur poste neutre » dès le milieu du projet, avec une *checklist* explicite (lancement, parcours principal, paiement test, visualisation responsive).

**La documentation au fil de l'eau coûte moins cher que la documentation rétrospective.** Les justifications de choix techniques, les schémas d'architecture, les comptes de test — tout cela est plus facile à écrire au moment où la décision est prise qu'en relecture finale.

**Comprendre une convention avant de la reprendre.** Que ce soit Tailwind, Stripe, le menu hamburger ou les outils de suivi, toutes les conventions techniques ou ergonomiques ont des raisons d'exister. Les reprendre sans comprendre produit un travail générique ; les comprendre puis les adapter produit un travail qu'on peut défendre.

### 7.3 Ce que je ferais différemment

Sur la base de l'expérience CYNA, voici ce que je mettrais en place dès le début d'un projet futur :

- poser dès le sprint 1 un **tableau écrit « qui fait quoi »** et une *definition of done* partagée ;
- mettre en place un jalon **« démo de bout en bout sur poste neutre »** au milieu du projet, avec critères explicites ;
- utiliser un **environnement hébergé partagé** (GitHub Pages, Netlify, Vercel) dès J1, pour éliminer les frictions d'environnement ;
- choisir un **outil de suivi clair et accessible** (type Trello) et le coupler à une messagerie informelle (Teams, Discord) ;
- réserver du **temps explicite pour les apprentissages techniques** en début de projet, plutôt que de les disperser dans le code de production ;
- documenter les **choix techniques au moment où ils sont pris**, pas en relecture finale ;
- générer les **types client depuis un schéma OpenAPI partagé** entre front et API, plutôt que les maintenir à la main des deux côtés.

### 7.4 Note de progression

**Ma progression globale sur ce projet : 7 / 10.**

Justification : j'ai livré une vitrine cohérente, contribué à la stabilisation collective de la démo, conçu une maquette qui a tenu la route, et progressé nettement sur Next.js, TypeScript, Tailwind, Stripe et Figma. Je retire trois points parce que j'aurais pu pousser plus tôt sur la cohérence des contrats front / API, anticiper la stabilisation finale dès le milieu du projet, structurer plus tôt les apprentissages partagés au sein de l'équipe (chacun découvrait des outils en parallèle, et un cadre commun aurait fluidifié les échanges), et demander dès le départ un environnement de test partagé. Le 7 reflète **un livrable défendable et une progression réelle**, pas un projet exécuté proprement de bout en bout.

---

## Conclusion

Le projet CYNA m'a permis de couvrir, sur huit mois, l'ensemble du cycle d'un projet de développement web e-commerce : conception, maquette, implémentation, intégration, stabilisation, soutenance. Mon périmètre principal — frontend de la vitrine et conception visuelle — a été tenu, et ma contribution à la démo de secours a été utile au collectif dans une phase critique.

Au-delà du livrable, le projet m'a fait progresser techniquement sur une stack que je ne maîtrisais pas (Next.js, Tailwind, Stripe), m'a confronté à des outils et des conventions que je découvrais (phpMyAdmin, GitHub Projects, menu hamburger), et m'a fait découvrir quelque chose sur ma manière de me situer dans une équipe — un naturel à fluidifier les frictions et à apprécier le travail collaboratif comme posture, pas seulement comme méthode.

Le BC3 et la rédaction du DAT (rendu prévu le 27 mai 2026) prolongeront ce travail en formalisant l'architecture, les choix techniques, les tests et la sécurité du projet. Le présent REX en pose la dimension personnelle et réflexive ; le DAT en posera la dimension technique structurée.

---

*Document personnel rédigé à la première personne. Aucune section n'est issue d'un copier-coller des REX d'autres membres de l'équipe.*
