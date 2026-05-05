# REX — Retour d'Expérience Projet CYNA

**Nom :** Baron
**Prénom :** François
**Formation :** CPI DEV — Chef de Projet Informatique
**Projet :** Plateforme e-commerce CYNA (BC2 / BC3)
**Équipe :** Jessica, Emmanuel, Théo, François
**Date :** 2026-05-04

---

## Introduction

Ce REX retrace ma participation au projet CYNA. Je décris ce que j'ai fait, ce que j'ai mal anticipé, et ce que j'en retiens. Le projet a livré une plateforme e-commerce pour CYNA, entreprise spécialisée en cybersécurité (SOC, EDR, XDR), avec une vitrine Next.js, une API NestJS, une base PostgreSQL via Prisma, une intégration Stripe et une application mobile Expo. La fin du projet a été marquée par une instabilité de la chaîne complète à l'approche de la soutenance, ce qui nous a conduits à préparer collectivement une démonstration de secours.

## 1. Présentation de mon rôle

Mon rôle dans le projet a été celui de **développeur frontend** sur la vitrine `cyna-vitrine`, construite en Next.js, React et TypeScript. Mon périmètre couvrait l'intégration des pages, la mise en place des composants partagés, le travail sur la cohérence visuelle, l'intégration avec l'API, et le respect du caractère mobile-first attendu par le cahier des charges.

Concrètement, j'ai porté trois axes :

- **Intégration des écrans** : pages catalogue, fiche produit, panier, checkout, recherche, compte, support, mentions légales et CGU. L'objectif était d'aboutir à un parcours utilisateur cohérent et démontrable.
- **Composants partagés et identité visuelle** : header, footer, logo, switcher de langue, fallbacks de chargement, blocs spécifiques au domaine cyber (flux d'actualités, threat feed mockés). L'enjeu côté CYNA était de tenir une identité crédible pour une entreprise de cybersécurité, pas une vitrine e-commerce générique.
- **Intégration avec l'API** : couche `services/`, hooks custom, types TypeScript partagés avec la forme des réponses NestJS, gestion d'erreurs côté client.

Mon rôle a évolué en fin de projet. Lorsque la chaîne complète (vitrine + API + base + paiement) est devenue instable à l'approche de l'oral, j'ai contribué à la préparation d'une version de secours, en m'appuyant sur ma connaissance du front pour relancer la partie vitrine dans un environnement maîtrisé.

## 2. Travail réalisé

**Pages et parcours.** J'ai travaillé sur les pages publiques et utilisateur : accueil, catalogue, fiche produit, recherche, panier, checkout, contact, support, espace compte, ainsi que les pages légales (CGU, mentions légales). L'objectif sur ces écrans était double : produire une expérience cohérente sur desktop et mobile, et réduire la dette d'intégration en factorisant les composants réutilisables le plus tôt possible.

**Composants partagés.** J'ai contribué à la mise en place des éléments transverses : `AppHeader`, `AppFooter`, `CynaLogo`, `LanguageSwitcher`, `CatalogSuspenseFallback`, et les blocs spécifiques au domaine cyber (`CyberNewsFeed`, `ThreatFeed`). Ces composants visent à donner à la vitrine une identité visuelle propre à CYNA, en cohérence avec l'attente d'une plateforme de cybersécurité plutôt que d'un e-commerce générique.

**Internationalisation et accessibilité.** Le projet incluait un système d'internationalisation (`i18n/`). J'ai contribué à son intégration côté composants pour que les chaînes principales soient traduisibles, en gardant la structure compatible avec une extension future à plusieurs langues.

**Intégration API et types partagés.** Côté `services/` et `types/`, j'ai travaillé sur l'alignement entre les réponses de l'API NestJS et leur consommation côté React. L'objectif était de faire correspondre les contrats : ce que renvoie l'API, ce qu'attend le composant, ce qui est rendu à l'utilisateur. Quand un endpoint évoluait côté backend, il fallait que le front suive sans casser silencieusement.

**Documentation et cadrage.** J'ai rédigé le document `CADRAGE-ALIGNEMENT.md` qui relie les exigences du cahier des charges initial (mobile-first, identité visuelle, catalogue, catégories SOC/EDR/XDR, chatbot, paiement, back-office, base relationnelle, outils collaboratifs) à l'implémentation réelle, en explicitant les écarts de stack. Ce document a servi de base de discussion pendant la soutenance.

**Contribution à la démonstration de secours.** En fin de projet, j'ai participé à la préparation d'une version backup utilisable pour l'oral, en me concentrant sur ce que je connaissais le mieux : faire tourner proprement la vitrine en local avec une configuration `.env` propre, un parcours minimal validé (accueil → catalogue → fiche produit → panier → checkout en mode test Stripe), et une cohérence visuelle préservée.

**Éléments à compléter à partir du `git log` (vérification par mes soins) :**
- 5 à 8 commits significatifs côté `cyna-vitrine` ;
- modules ou pages où ma présence est la plus forte ;
- composants dont je suis principal contributeur.

## 3. Difficultés rencontrées

**Difficulté n°1 — instabilité de la chaîne complète à l'approche de l'oral.** La vitrine seule pouvait se lancer, mais le parcours complet (vitrine → API → base → paiement) ne tenait pas de bout en bout dans la dernière semaine. Ce n'est pas un seul bug, c'est une accumulation : intégrations tardives, variables d'environnement non synchronisées entre machines, dépendances qui n'étaient pas alignées sur tous les postes, parcours testés isolément mais pas en chaîne. L'impact concret : sans précaution, la démonstration risquait de s'arrêter dès la première étape. Cette difficulté est avant tout une difficulté d'intégration et de jalon collectif. Nous n'avions pas posé suffisamment tôt un point explicite "version démontrable de bout en bout, validée sur un poste neutre".

**Difficulté n°2 — hétérogénéité de niveau dans l'équipe.** Jessica et Emmanuel ont commencé la programmation récemment. Leur contribution s'est faite davantage sur l'apprentissage, les tests, la compréhension et la documentation que sur la production de modules techniques complexes. Ce n'est pas un reproche — c'est un état de fait que toute équipe rencontre. Mais cela demande une organisation que nous n'avons pas mise en place dès le départ : tâches calibrées au niveau, temps explicite pour expliquer, jalons intermédiaires pour vérifier. Sans cette organisation, la charge se concentre mécaniquement sur les profils plus autonomes en fin de projet, ce qui n'est ni soutenable ni équitable.

**Difficulté n°3 — écart entre cadrage et implémentation.** Le cadrage initial mentionnait Vue / Cordova / Koa / MariaDB. La stack réelle est Next.js / NestJS / Prisma / Expo. Cet écart n'est pas en soi un problème — les choix techniques peuvent évoluer pendant un projet — mais il devient un problème si on présente le résultat sans l'expliquer. Il fallait être capable de justifier ces choix devant le jury et dans le DAT, sans masquer la divergence.

**Difficulté n°4 — pression et priorisation en fin de projet.** La dernière semaine a imposé des arbitrages serrés : finaliser ou stabiliser, corriger ou documenter, préparer la démo ou l'argumentaire. Toutes les tâches étaient légitimes, mais elles ne tenaient pas dans le temps disponible. J'ai dû accepter de ne pas tout faire et de choisir ce qui était indispensable pour l'oral.

**Difficulté n°5 — cohérence front / API.** Les contrats entre le front et l'API ont parfois bougé sans annonce explicite. Un changement de format de réponse côté NestJS pouvait casser silencieusement un composant React. Ce n'est pas une erreur d'une seule personne — c'est l'absence d'un contrat formel partagé (schéma OpenAPI ou types générés depuis une source unique). Avec ce manque, la synchronisation se fait à la main, et une partie passe à travers.

## 4. Solutions mises en place

**Sur la stabilisation de la démo : préparation collective d'une version de secours.** Plutôt que de miser uniquement sur la stabilisation de la chaîne complète à J-3, nous avons décidé en équipe de préparer une version de secours utilisable pour l'oral. L'objectif n'était pas de remplacer le projet principal, mais d'avoir un filet : un environnement maîtrisé, lançable depuis une machine connue, avec un parcours minimal validé. J'ai contribué à cette préparation côté frontend, parce que c'était mon périmètre de connaissance.

**Sur la transparence : distinguer OK / partiel / non réalisé.** En soutenance comme dans le DAT, j'ai poussé pour ne pas présenter le projet comme un livrable parfait. Une fonctionnalité partielle expliquée comme telle est plus défendable qu'une fonctionnalité présentée comme finie qui se révèle cassée à la première question. Cette posture rejoint celle du guide REX et de la grille d'évaluation : la transparence n'est pas une faiblesse, c'est un critère d'évaluation.

**Sur l'équipe : adapter les tâches au niveau, accepter la pédagogie comme une partie du travail.** En cours de projet, j'ai progressivement adapté ma manière de travailler avec Jessica et Emmanuel : décomposer les problèmes en étapes, expliquer le contexte avant la consigne, accepter qu'une tâche prenne plus de temps si elle sert aussi d'apprentissage. Avec du recul, j'aurais voulu structurer cela dès le sprint 1, pas à mi-parcours.

**Sur l'écart cadrage / réalisation : documenter au lieu de masquer.** `CADRAGE-ALIGNEMENT.md` n'est pas un document esthétique. C'est une matrice : exigence → statut → justification. Cette forme rend l'écart explicable et limite la zone d'attaque possible en soutenance.

**Sur la cohérence front / API : alignement de bout en bout par les types.** J'ai poussé l'idée de partager les types TypeScript entre front et API quand c'était possible. Quand le partage formel n'était pas faisable, j'ai au moins maintenu côté `cyna-vitrine` un dossier `types/` aligné manuellement, et j'ai demandé à être prévenu lors d'un changement de contrat côté API. Ce n'est pas une solution complète — la solution complète serait un contrat OpenAPI partagé — mais c'est une discipline qui réduit le risque de casse silencieuse.

## 5. Compétences acquises

Je distingue les compétences techniques des compétences transversales. Le projet a fait progresser les deux, mais à des degrés différents.

### Compétences techniques

| Compétence | Niveau avant | Niveau après |
|---|---|---|
| Next.js / React | Débutant | Opérationnel |
| TypeScript en équipe | Notions | Opérationnel |
| Architecture frontend modulaire | Débutant | Intermédiaire |
| Internationalisation (i18n) | Aucun | Notions / opérationnel sur cas simples |
| Intégration API REST côté client | Notions | Opérationnel |
| Gestion d'état React (context, hooks) | Notions | Opérationnel |
| Mobile-first et responsive design | Notions | Opérationnel |
| Variables d'environnement, configuration multi-env | Débutant | Opérationnel |
| Lecture critique d'un dépôt existant | Intermédiaire | Confirmé |

Le saut le plus net pour moi concerne la **lecture d'un projet existant** et la **discipline de cohérence front / API**. Avant CYNA, je voyais le développement comme la production de fonctionnalités. Le projet m'a forcé à inverser la perspective dans la dernière phase : entrer dans un état du dépôt que je n'avais pas écrit seul, identifier ce qui marche, ce qui plante, ce qui peut être lancé, ce qui doit être désactivé. Cette compétence a une valeur professionnelle directe : c'est exactement ce qu'on fait en arrivant sur un projet existant en entreprise.

### Compétences transversales

- **Priorisation sous contrainte** : choisir ce qui est indispensable quand tout n'est pas atteignable.
- **Documentation au moment où elle est utile** : `CADRAGE-ALIGNEMENT.md` aurait été plus simple à écrire en cours de projet qu'à la fin.
- **Communication des limites** : expliquer ce qui ne marche pas sans dévaluer le travail collectif.
- **Pédagogie pratique** : adapter une consigne au niveau de la personne qui la reçoit.

Je ne mets pas "leadership" dans cette liste. Le mot est trop large pour ce que j'ai fait. Je suis resté dans mon périmètre frontend, avec une contribution ponctuelle à la stabilisation collective.

## 6. Travail en équipe

**Outils.** Microsoft Teams pour la communication continue, Trello pour le suivi de tâches (colonnes Backlog → In Progress → In Review → Done), GitHub pour le code et les pull requests. Pas de standup formel quotidien — plutôt des points réguliers asynchrones et des sessions de travail synchrones sur Teams quand un blocage le justifiait.

**Rituels.** Sprints courts, rétrospectives légères, revues de code via PR. Le rituel SCRUM était présent dans l'esprit, mais pas dans la rigueur stricte du framework. Avec du recul, des rituels plus stricts (definition of done, jalons explicites, démo intermédiaire) auraient probablement aidé à anticiper la stabilisation finale.

**Répartition des rôles, telle que je la comprends.**
- Théo : Lead Développeur, architecture API, structure NestJS, déploiement et hosting du projet.
- Jessica : développement backend, authentification, modèle de données, intégration Stripe.
- Emmanuel : participation au front, tests, apprentissage progressif des outils.
- François (moi) : développement frontend (vitrine Next.js), composants partagés, intégration API côté client, documentation d'alignement, contribution à la démonstration de secours.

Cette répartition est une description ex-post. Elle n'a pas été formalisée au sprint 1 avec un document partagé. C'est un point que je retiens : un tableau de rôles écrit dès le début, même imparfait, aurait évité plusieurs micro-frictions sur "qui fait quoi" en cours de route.

**Moment fort de collaboration.** Le moment que je retiens n'est pas une livraison glorieuse, c'est la décision collective, à quelques jours de l'oral, d'assumer ensemble une stratégie de présentation incluant un backup. Personne n'a essayé de cacher la situation, personne ne s'est replié sur son périmètre. Nous avons reconnu collectivement que la priorité n'était plus de tout finir, mais de tenir l'oral avec un récit honnête. Cette lucidité d'équipe a été la condition de la suite.

## 7. Bilan personnel

Le projet CYNA a été dense et exigeant, particulièrement dans sa dernière semaine. Il m'a confronté à une situation que je retrouverai en contexte professionnel : un livrable attendu, une date fixe, une chaîne technique partiellement instable, une équipe avec des niveaux différents, et la nécessité de présenter quelque chose de fonctionnel.

Ce que je retiens en premier : **une version démontrable de bout en bout doit exister tôt et être testée régulièrement**, pas en fin de projet. Construire des fonctionnalités sans vérifier régulièrement que toute la chaîne tient ensemble produit une dette qui se paie au pire moment. Si je devais recommencer, je poserais un jalon "version démontrable validée sur poste neutre" dès le milieu du projet, avec une checklist explicite (lancement, parcours principal, paiement test, visualisation responsive).

Ce que je retiens en second : **la documentation au fil de l'eau coûte moins cher que la documentation rétrospective**. `CADRAGE-ALIGNEMENT.md` aurait été plus facile à écrire au sprint 2 qu'au sprint final. Pareil pour les justifications de choix techniques, les schémas d'architecture, les comptes de test.

Ce que je retiens en troisième : **les contrats entre couches doivent être explicites**, même dans un projet d'école. Quand le front et l'API ne partagent pas un schéma formel, la synchronisation se fait à la main et passe à travers les mailles dès qu'on accélère. Une simple génération de types depuis Swagger / OpenAPI réduit cette dette quasi à zéro pour un coût d'installation faible.

### Ce que je ferais différemment

- Poser dès le sprint 1 un tableau écrit "qui fait quoi" et une definition of done partagée.
- Mettre en place un jalon "démo de bout en bout sur poste neutre" au milieu du projet, avec critères explicites.
- Générer les types client depuis un schéma OpenAPI partagé, plutôt que les maintenir à la main des deux côtés.
- Prévoir un temps explicite d'accompagnement pour les profils débutants, plutôt que d'attendre que l'apprentissage se fasse en sous-main.
- Documenter les choix techniques au moment où ils sont pris, pas en relecture.
- Mettre en place une intégration continue minimale (lint, build, smoke test) dès le squelette du dépôt.
- Anticiper l'écart entre cadrage et implémentation par un point trimestriel formalisé, plutôt qu'un rattrapage final.

### Note de progression

**Ma progression globale sur ce projet : 7 / 10.**

Justification : j'ai livré une vitrine cohérente, contribué à la stabilisation collective de la démo, et progressé nettement sur Next.js, TypeScript et l'intégration API côté client. Je retire trois points parce que j'aurais pu pousser plus tôt sur la cohérence des contrats front / API, anticiper la stabilisation finale dès le milieu du projet, et structurer plus tôt l'accompagnement des profils débutants. Le 7 reflète un livrable défendable et une progression réelle, pas un projet exécuté proprement de bout en bout.

---

*Document personnel, rédigé à la première personne. Aucune section copiée des REX d'autres membres de l'équipe. Les éléments marqués "à compléter" requièrent une vérification par moi à partir du `git log` du dépôt avant rendu final.*
