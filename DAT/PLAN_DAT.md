# Plan détaillé — DAT CYNA

**Cible :** ≥50 pages Word
**Échéance :** 27 mai 2026 (BC3)
**Barème :** 50 points sur 8 critères (cf. `CHECKLIST_IA_DAT_REX.md` § 3)
**Convention de typographie :** identique au REX (Heading 1 rouge / Heading 2 bleu / Heading 3 vert)

Ce plan organise le DAT en **20 sections + page de garde + sommaire** pour atteindre la cible 50+ pages. Pour chaque section : objectif, contenu type, pages visées, artefacts nécessaires, et lien avec le critère du barème.

---

## Vue d'ensemble — Mapping sections / barème

| Critère barème | Points | Sections concernées |
|---|---|---|
| 3.1 Implémentations techniques livrées | 10 | §2, §5, §6, §10 |
| 3.2 Pertinence et clarté des schémas | 10 | §4, §7, §8, §9, §11 |
| 3.3 Qualité des tests et résultats | 10 | §13 |
| 3.4 Organisation et structuration | 5 | Tout le doc, §3 |
| 3.5 Sécurité et conformité | 5 | §8 |
| 3.6 Scalabilité et performance | 5 | §16 |
| 3.7 Respect des délais et conformité au cadrage | 3 | §14 |
| 3.8 Gouvernance et vision | 2 | §17, §18 |

---

## Estimation pages cumulées

| Section | Titre | Pages |
|---|---|---|
| Front matter | Page de garde + historique + sommaire | 4 |
| Résumé exécutif | | 1 |
| §1 | Contexte et objectifs | 3 |
| §2 | Périmètre fonctionnel | 4 |
| §3 | Organisation projet | 3 |
| §4 | Architecture générale | 4 |
| §5 | Frontend | 5 |
| §6 | Backend / API | 5 |
| §7 | Base de données | 8 *(déjà rédigé via MCD/MLD)* |
| §8 | Sécurité | 4 |
| §9 | Paiement | 3 |
| §10 | Mobile | 2 |
| §11 | Déploiement | 3 |
| §12 | Backup de démonstration | 2 |
| §13 | Tests et validation | 4 |
| §14 | Conformité au cadrage | 3 |
| §15 | Risques et limites | 2 |
| §16 | Scalabilité et performance | 3 |
| §17 | Maintenance et évolutions | 2 |
| §18 | Gouvernance et vision | 1 |
| §19 | Conclusion | 1 |
| §20 | Annexes | 4 |
| **Total** | | **~71 p** |

> **Note :** estimation **généreuse** parce que les schémas et tableaux occupent de la place. Cible ≥50p atteinte avec marge. Si on dépasse trop, on coupera à la rédaction.

---

## Détail par section

### Front matter

#### Page de garde (1p)
- Logo formation + logo CYNA (si dispo)
- Titre : *Document d'Architecture Technique — Plateforme e-commerce CYNA*
- Auteur, formation (CPI DEV), promotion, date
- Numéro de version

#### Historique du document (1p)
Tableau : Version | Date | Auteur | Modifications.

#### Sommaire (auto-généré pandoc, 2p)

#### Résumé exécutif (1p)
- Une page condensant : projet, livrable, équipe, état (livré + partiel), points forts, limites assumées.

---

### §1 — Contexte et objectifs (3p)

**Objectif :** poser le décor pour un lecteur qui découvre le projet.

**Contenu :**
- 1.1 Présentation de CYNA (entreprise, métier cybersécurité, gamme SOC/EDR/XDR) — *artefact : site cyna-it.fr, brief client*
- 1.2 Objectifs du projet (plateforme e-commerce, formats services, parcours utilisateur)
- 1.3 Public cible (RSSI, DSI, ETI françaises)
- 1.4 Cadre académique (formation CPI DEV, fil rouge, BC2 + BC3)

**Artefacts requis :** brief, document de cadrage, capture site cyna-it.fr.

---

### §2 — Périmètre fonctionnel (4p)

**Objectif :** lister exhaustivement les fonctionnalités livrées, partielles, hors périmètre.

**Contenu :**
- 2.1 Vue d'ensemble fonctionnel (carte mentale ou diagramme)
- 2.2 Fonctionnalités **livrées** (tableau avec : nom / description / route / écran)
  - Vitrine publique : accueil, catalogue, fiche produit, recherche, cart, checkout, contact, support, légal
  - Compte utilisateur : authentification, profil, adresses, paiements, commandes, abonnements, factures
  - Back-office : routes admin (Swagger), 2FA TOTP, gestion catalogue
  - Mobile : Expo, navigation catégories
- 2.3 Fonctionnalités **partielles** : PayPal (Stripe OK, PayPal différé), chatbot (FAQ + Gemini, escalade humain manquante)
- 2.4 **Hors périmètre / reportées** : hosting prod, monitoring, paiement test → prod

**Artefacts requis :** code (déjà dispo), captures écrans (à produire), Swagger (à exporter), CADRAGE-ALIGNEMENT.md (existe).

---

### §3 — Organisation projet (3p)

**Objectif :** documenter l'équipe, la méthode, les outils — cohérence avec le REX.

**Contenu :**
- 3.1 Équipe et rôles (Théo, Jessica, Emmanuel, François) — matrice RACI cohérente
- 3.2 Méthodologie (sprints courts, points hebdo, rétrospectives légères)
- 3.3 Outils utilisés (GitHub + GitHub Projects, Teams/Discord, Figma, Google Slides, Stripe Dashboard)
- 3.4 **Trello reconstitué** *(reconstitution a posteriori pour visualisation, pas l'outil utilisé)* — captures du board reconstitué + mention explicite

**Artefacts requis :** Trello reconstitué (à faire), captures GitHub Projects, organigramme.

---

### §4 — Architecture générale (4p)

**Objectif :** donner la vue système avant de plonger dans les briques.

**Contenu :**
- 4.1 Vue logique (composants : `cyna-vitrine` ↔ `cyna-api` ↔ PostgreSQL ↔ Stripe ↔ Gemini ↔ `Cyna_mobile`)
- 4.2 Vue de déploiement (Netlify + hosting API + BDD managée)
- 4.3 **Justification de l'écart de stack** : Vue/Cordova/Koa/MariaDB (cadrage) → Next.js/NestJS/Prisma/PostgreSQL (réalisation). Pourquoi : maîtrise équipe, écosystème, déploiement Netlify natif, type-safety, etc.
- 4.4 Diagramme de composants (Mermaid `graph` ou `C4`)
- 4.5 Diagramme de séquence : commande complète (visiteur → checkout → Stripe → webhook → BDD)

**Artefacts requis :** schémas Mermaid (à créer), screenshots déploiement Netlify.

---

### §5 — Frontend (`cyna-vitrine`) (5p)

**Objectif :** documenter la couche présentation.

**Contenu :**
- 5.1 Stack : Next.js 16, React 19, TypeScript 5, Tailwind 4, framer-motion, Radix, Headless UI
- 5.2 Architecture App Router (routes file-based, layouts, server vs client components)
- 5.3 Pages livrées (tableau exhaustif des routes — déjà dans REX, à enrichir)
- 5.4 Composants partagés (`AppHeader`, `AppFooter`, `CynaLogo`, `AppSearch`, `LanguageSwitcher`, `LegalPageShell`, `CyberNewsFeed`, `ThreatFeed`, `Providers`)
- 5.5 i18n FR/EN (`I18nProvider`, `LanguageSwitcher`)
- 5.6 Identité visuelle (variables CSS, dark theme forcé, logo SVG dégradé)
- 5.7 **Maquette Figma** : URL + captures écrans clés (à reconstituer pour les écrans manquants)
- 5.8 État du build (`npm run build` + résultat)

**Artefacts requis :** captures Figma, captures écrans live, output `npm run build`.

---

### §6 — Backend / API (`cyna-api`) (5p)

**Objectif :** documenter la couche serveur.

**Contenu :**
- 6.1 Stack : NestJS, Prisma, modules
- 6.2 Architecture en couches (Controller → Service → Repository/Prisma)
- 6.3 Routes principales (groupées par module : auth, users, products, categories, cart, orders, subscriptions, invoices, payement, contact, chatbot, admin) — **export Swagger requis**
- 6.4 Sécurité technique : JWT (sessions courtes + refresh), 2FA TOTP (otplib), role-based access (USER/ADMIN), middleware
- 6.5 Validation : DTOs, class-validator, sérialisation
- 6.6 Gestion d'erreurs : exception filters, format de réponse uniforme

**Artefacts requis :** export Swagger JSON ou OpenAPI, capture Swagger UI, lecture des modules NestJS.

---

### §7 — Base de données (8p) — *DÉJÀ RÉDIGÉ*

Voir `DAT/MCD_MLD_CYNA.md`. À intégrer comme section 7 du DAT final.

**Contenu :**
- 7.1 Vue d'ensemble (Mermaid global)
- 7.2 MCD par domaine (6 sous-vues)
- 7.3 MLD : 19 tables détaillées
- 7.4 Énumérations
- 7.5 Choix de modélisation (snapshots, support invités, cascades, sécurité paiement, 2FA, conservation factures, index)

---

### §8 — Sécurité (4p)

**Objectif :** justifier les mesures (5 pts barème).

**Contenu :**
- 8.1 Authentification : sessions JWT, password reset, email verification, rate limiting
- 8.2 Autorisation : RBAC, route-level guards, protection back-office
- 8.3 2FA : TOTP via `otplib`, setup/confirm flow
- 8.4 Sécurité paiement : PCI-DSS, tokens Stripe uniquement, pas de PAN brut
- 8.5 **RGPD** : données perso (User, ContactMessage), droit à l'oubli (cascade vs SET NULL), conservation factures (10 ans légal), conditions générales / mentions légales
- 8.6 Risques résiduels et mitigation : XSS, CSRF, injection, brute-force
- 8.7 Variables d'environnement et secrets (`.env`, gestion entre local/test/prod)

**Artefacts requis :** matrice de risques (à créer), capture de Conditions Générales, screenshots sécurité (2FA, login).

---

### §9 — Paiement (3p)

**Objectif :** documenter le flux Stripe + statut PayPal.

**Contenu :**
- 9.1 Flux Stripe : `PaymentIntent` côté serveur → `Elements` côté client → confirmation → webhook → mise à jour `Order.status`
- 9.2 **Diagramme de séquence** complet (Mermaid `sequenceDiagram`)
- 9.3 Tests en mode dev (cartes de test, comptes Stripe Dashboard)
- 9.4 PayPal : status partiel, recommandation (PayPal Buttons SDK + webhook dédié)
- 9.5 Idempotence et gestion des doublons (`paymentIntentId` UK)

**Artefacts requis :** diagramme de séquence, capture Stripe Dashboard test, capture flux checkout.

---

### §10 — Mobile (`Cyna_mobile`) (2p)

**Objectif :** documenter le périmètre mobile.

**Contenu :**
- 10.1 Stack : Expo, React Native, TypeScript
- 10.2 Périmètre couvert : navigation catégories, fetch API
- 10.3 État du livrable : prototype fonctionnel ou démo only
- 10.4 Limites : pas de paiement mobile, pas de notifications push

**Artefacts requis :** captures simulateur, lecture du dossier `Cyna_mobile/`.

---

### §11 — Déploiement (3p)

**Objectif :** documenter l'infrastructure.

**Contenu :**
- 11.1 Vitrine sur Netlify (`@netlify/plugin-nextjs`, build + deploy)
- 11.2 API : status (local dev / hébergement à documenter)
- 11.3 BDD : PostgreSQL (managée si déployée, sinon local Docker)
- 11.4 Variables d'environnement : tableau par environnement (dev / démo / prod cible)
- 11.5 Stratégie démo : poste neutre + parcours validé
- 11.6 Recommandation CI/CD : actions GitHub (build + lint + test)

**Artefacts requis :** capture Netlify dashboard, screenshots `.env.example`.

---

### §12 — Backup de démonstration (2p)

**Objectif :** transparent et factuel sur la stratégie de secours.

**Contenu :**
- 12.1 Contexte : instabilité de la chaîne complète à J-3
- 12.2 Stratégie backup : environnement maîtrisé, machine connue, parcours minimal validé
- 12.3 Parcours démo : accueil → catalogue → fiche → panier → checkout test
- 12.4 Apprentissage : un jalon "démo bout-en-bout sur poste neutre" plus tôt aurait évité la situation

**Artefacts requis :** captures parcours backup.

---

### §13 — Tests et validation (4p) — **10 pts barème**

**Objectif :** documenter la stratégie de test (critère 3.3, 10 pts).

**Contenu :**
- 13.1 Stratégie : tests manuels prioritaires (parcours critiques), tests automatisés où possible
- 13.2 Tests unitaires / e2e existants (à recenser dans `cyna-api/test/`)
- 13.3 Tests de paiement : cartes Stripe test, scenarios (succès, échec, 3DS, refus)
- 13.4 Tests d'auth : signup, login, password reset, 2FA setup/login
- 13.5 Tests responsive (mobile/desktop, dark mode)
- 13.6 Build & lint : `npm run build`, `npm run lint` — résultats par projet
- 13.7 Comptes de test (`TEST_ACCOUNTS.md` existant)
- 13.8 Liste des bugs connus
- 13.9 **Recommandation** : tests de charge, e2e Playwright, monitoring continu

**Artefacts requis :** recensement tests existants, captures Stripe Dashboard test, output build/lint, exécution scénario démo avec captures.

---

### §14 — Conformité au cadrage (3p) — **3 pts barème**

**Objectif :** matrice exigences / réalisation.

**Contenu :**
- 14.1 Tableau exigences cadrage (mobile-first, identité, catalogue 5-7 produits, 3 catégories, chatbot, Stripe+PayPal, back-office, BDD, outils collaboratifs)
- 14.2 Statut par exigence : **OK / Partiel / Non réalisé / Hors périmètre**
- 14.3 Justification des écarts (notamment stack)
- 14.4 Backup comme réponse au risque démo

**Artefacts requis :** CADRAGE-ALIGNEMENT.md (existant, à mettre à jour).

---

### §15 — Risques et limites (2p)

**Objectif :** anticipation et lucidité.

**Contenu :**
- 15.1 Risques techniques résiduels (instabilité chaîne, dépendances tierces, secrets)
- 15.2 Limites du livrable (PayPal différé, mobile prototype, pas de prod)
- 15.3 Plan de mitigation

---

### §16 — Scalabilité et performance (3p) — **5 pts barème**

**Objectif :** stratégie d'évolution sous charge.

**Contenu :**
- 16.1 Limites actuelles (single instance, pas de cache, BDD non répliquée)
- 16.2 Évolution recommandée : autoscaling Netlify (front), API stateless derrière LB, BDD managée avec read replicas, cache Redis pour catalogue, CDN images
- 16.3 Index PostgreSQL : recommandations détaillées (déjà dans MCD/MLD §3.7)
- 16.4 Pagination + recherche trigramme (`pg_trgm` sur `products.name`)
- 16.5 Monitoring : APM, logs centralisés (Datadog, Grafana, Better Stack)

---

### §17 — Maintenance et évolutions (2p)

**Objectif :** roadmap.

**Contenu :**
- 17.1 Court terme : stabiliser, finaliser PayPal, renforcer tests
- 17.2 Moyen terme : industrialiser CI/CD, monitoring, mobile
- 17.3 Dette technique identifiée

---

### §18 — Gouvernance et vision (1p) — **2 pts barème**

**Objectif :** vision de gouvernance technique.

**Contenu :**
- 18.1 Gouvernance technique (revue de code, ADR, DoD)
- 18.2 Vision d'évolution (multi-tenant, marketplace partenaires, API publique)

---

### §19 — Conclusion (1p)

Synthèse : projet livré, points forts, limites assumées, ce que CYNA peut en tirer.

---

### §20 — Annexes (4p)

- 20.1 Glossaire (SOC, EDR, XDR, PCI-DSS, RGPD, JWT, TOTP, etc.)
- 20.2 Routes API détaillées (export Swagger en JSON ou tableau)
- 20.3 Schéma SQL complet (`CREATE TABLE` extrait de Prisma migration)
- 20.4 Captures supplémentaires
- 20.5 Liste des dépendances principales (front + API + mobile)

---

## Inventaire des artefacts

| Artefact | Statut | Action |
|---|---|---|
| Code source 4 dépôts | ✅ Existant | Lecture |
| `CADRAGE-ALIGNEMENT.md` | ✅ Existant (à mettre à jour) | Mise à jour matrice + RACI corrigée |
| `TEST_ACCOUNTS.md` (cyna-vitrine) | ✅ Existant | À lire et intégrer §13 |
| Schéma Prisma | ✅ Existant | Déjà exploité (MCD/MLD) |
| MCD/MLD | ✅ Livré (`DAT/MCD_MLD_CYNA.md`) | À intégrer §7 |
| Captures vitrine (toutes pages) | ❌ Manquant | À produire |
| Captures admin / Swagger | ❌ Manquant | À produire (lancer API + screenshot) |
| Captures mobile | ❌ Manquant | À produire (Expo) |
| Maquette Figma originale | ⚠️ Partielle | Reconstitution html-to-figma + captures |
| Trello reconstitué | ❌ À créer | Section 3.4 (avec marquage explicite) |
| Schéma architecture globale | ❌ À créer | Mermaid (cf. §4) |
| Diagramme séquence paiement | ❌ À créer | Mermaid (cf. §9) |
| Diagramme séquence auth | ❌ À créer | Mermaid (cf. §6 ou §8) |
| Schéma déploiement | ❌ À créer | Mermaid + capture Netlify |
| Export Swagger | ❌ À produire | Lancer API → `/api-json` ou similaire |
| Output `npm run build` | ❌ À produire | Run + capture |
| Logo formation / CYNA | ⚠️ À vérifier | Demander à François |

---

## Méthode de rédaction

Identique au REX : **section par section avec validation**, en gardant un ton technique (pas le ton personnel du REX). Le DAT est un document professionnel, factuel, structuré.

**Cadence proposée :**
1. Sections "factuelles" prioritaires (peu de subjectivité requise) : §7 *(déjà fait)*, §1, §2, §5, §6, §10, §11, §14, §20
2. Sections "à analyser" (nécessitent réflexion + retours) : §4, §8, §9, §13, §15, §16, §17
3. Sections "front matter" en dernier : page de garde, sommaire, résumé exécutif (quand le reste est stabilisé)

**Échéance** : 27 mai 2026 → 17 jours. Avec environ 1-2 sections par jour, faisable en gardant une marge pour les artefacts visuels (captures, schémas).

---

*Plan rédigé le 2026-05-10 à partir de la checklist DAT (`CHECKLIST_IA_DAT_REX.md` § 3) et du MCD/MLD livré (`DAT/MCD_MLD_CYNA.md`).*
