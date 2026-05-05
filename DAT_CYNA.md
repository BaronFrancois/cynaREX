# Document d'Architecture Technique
# Plateforme e-commerce CYNA

---

| Champ | Valeur |
|---|---|
| **Projet** | Plateforme e-commerce CYNA |
| **Client** | CYNA (services managés de cybersécurité — SOC, EDR, XDR) |
| **Cadre académique** | CPI DEV — Chef de Projet Informatique, projet Fil Rouge |
| **Bloc de compétences** | BC3 — Superviser la mise en œuvre d'un projet informatique |
| **Pondération** | 100 % du BC3 |
| **Équipe** | Jessica, Emmanuel, Théo, François |
| **Auteur principal du document** | François Baron |
| **Version** | 1.0 |
| **Date** | 2026-05-04 |
| **Statut** | Soumis pour évaluation |

---

## Historique du document

| Version | Date | Auteur | Modifications |
|---|---|---|---|
| 0.1 | 2026-04-15 | F. Baron | Squelette initial du document, plan, sections. |
| 0.2 | 2026-04-22 | F. Baron | Première rédaction — contexte, périmètre, architecture générale. |
| 0.3 | 2026-04-29 | F. Baron | Ajout sections frontend, backend, base de données. |
| 0.4 | 2026-05-02 | F. Baron | Sécurité, paiement, mobile, déploiement, backup démo. |
| 0.5 | 2026-05-03 | F. Baron | Tests, risques, maintenance, conclusion, annexes. |
| 1.0 | 2026-05-04 | F. Baron | Relecture finale, vérification matrice de conformité, intégration retours équipe. |

---

## Avertissement préalable et notes méthodologiques

Ce DAT est rédigé en accord avec les principes de transparence et de traçabilité énoncés dans le guide d'évaluation du projet Fil Rouge CPI DEV. Il décrit la solution telle qu'elle est, et non telle qu'elle devrait idéalement être. Les écarts entre le cadrage initial et la réalisation finale sont explicitement documentés, en particulier au § 4 (Contexte et objectifs), § 5 (Périmètre fonctionnel), § 17 (Risques et limites) et dans la matrice de conformité en annexe A.

Le projet CYNA s'inscrit dans une démarche pédagogique. Il intègre une stack technique moderne (Next.js, NestJS, Prisma, PostgreSQL, Stripe, Expo) qui s'écarte de la stack mentionnée dans le document de cadrage initial (Vue / Cordova / Koa / MariaDB). Cet écart fait l'objet d'une justification au § 4.4 et d'une trace dans le document `CADRAGE-ALIGNEMENT.md` versionné dans le dépôt `cyna-vitrine`.

Lorsqu'une fonctionnalité est partielle, elle est qualifiée explicitement comme telle. Lorsqu'une fonctionnalité ne figure pas dans le livrable final, son absence est documentée avec une justification (priorisation, dépendance externe, complexité supérieure au temps disponible).

Le présent document peut contenir des annexes, matrices et schémas qui sont eux-mêmes des livrables en propre (matrice de conformité, schéma de base de données, diagramme de séquence paiement). Chaque schéma est titré, numéroté, légendé et cité dans le texte.

---

## Sommaire

1. Résumé exécutif
2. Glossaire et acronymes
3. Contexte et objectifs
4. Périmètre fonctionnel
5. Organisation projet
6. Architecture générale
7. Frontend — `cyna-vitrine`
8. Backend / API — `cyna-api`
9. Base de données
10. Sécurité
11. Paiement
12. Mobile — `Cyna_mobile`
13. Déploiement
14. Backup de démonstration
15. Tests et validation
16. Risques et limites
17. Maintenance et évolutions
18. Conclusion
19. Annexes
   - A. Matrice de conformité aux exigences
   - B. Schéma de base de données (extrait du modèle Prisma)
   - C. Diagrammes de séquence
   - D. Captures d'écran et preuves d'exécution
   - E. Liste des routes API
   - F. Comptes de test
   - G. Bibliographie et références

---

# 1. Résumé exécutif

CYNA est une entreprise spécialisée en services managés de cybersécurité. Son catalogue commercial s'organise autour de trois familles de produits — SOC (Security Operations Center), EDR (Endpoint Detection and Response) et XDR (Extended Detection and Response). Avant le projet, le canal commercial reposait essentiellement sur des prises de contact directes via le site institutionnel et sur des rendez-vous commerciaux. CYNA a exprimé le besoin de moderniser ce canal en proposant une plateforme e-commerce permettant à ses prospects et clients de découvrir l'offre, de comparer les abonnements, de souscrire en ligne et de suivre leur abonnement depuis un espace personnel.

Le présent document décrit la solution technique livrée à l'issue du projet pédagogique CPI DEV, ainsi que les choix d'architecture, les écarts par rapport au cadrage initial, les tests effectués, les limites identifiées et les axes de maintenance et d'évolution.

La solution livrée se compose de quatre dépôts cohérents :

- **`cyna-vitrine`** — application web e-commerce publique et utilisateur, construite en Next.js 16, React 19, Tailwind CSS 4 et TypeScript. Inclut le catalogue, la recherche, les fiches produit, le panier, le checkout Stripe, l'espace compte, le support, les pages légales (CGU, mentions légales) et l'internationalisation FR / EN.
- **`cyna-api`** — service applicatif en NestJS 11 / TypeScript, exposant l'API REST de la plateforme. Intègre Prisma 7, PostgreSQL, Stripe Server SDK 20, JWT via Passport, OTP TOTP pour la 2FA admin (otplib), bcrypt pour le hachage de mots de passe, et Swagger pour la documentation interactive (`/docs`).
- **`Cyna_mobile`** — application mobile en React Native 0.81 / Expo 54 avec expo-router. Périmètre limité par rapport à la vitrine — illustrative et démonstrative, non destinée à la mise en production en l'état.
- **`backup`** — copie de secours du couple vitrine + API préparée en fin de projet pour fiabiliser la démonstration de soutenance.

L'application implémente la totalité des familles fonctionnelles attendues (catalogue, panier, checkout, compte utilisateur, support, back-office, paiement) à des degrés de finition variables. Les fonctionnalités centrales de l'expérience utilisateur (parcours de découverte, achat avec Stripe en mode test, gestion du compte) sont opérationnelles. Les fonctionnalités secondaires ou périphériques (PayPal natif, internationalisation complète, application mobile productisée, monitoring applicatif) sont partielles ou hors périmètre, et leur statut est précisé dans la matrice de conformité (annexe A).

Le projet a connu en fin de cycle une instabilité de la chaîne complète, ce qui a conduit l'équipe à préparer une version de secours (le dépôt `backup`) afin de fiabiliser la démonstration en soutenance. Cette mesure de gestion de risque est documentée au § 14 et présentée avec transparence dans le REX et dans le présent document.

La sécurité, la scalabilité et la performance sont traitées au § 10, § 16 et § 17. Le dimensionnement actuel correspond à un MVP académique. Une mise en production réelle nécessite plusieurs travaux complémentaires identifiés dans la roadmap (§ 17).

---

# 2. Glossaire et acronymes

| Terme | Définition |
|---|---|
| **API** | Application Programming Interface. Couche d'intégration entre la vitrine et la base de données. |
| **CYNA** | Société cliente fictive du projet pédagogique, spécialisée en cybersécurité. |
| **DAT** | Document d'Architecture Technique — le présent document. |
| **DCT** | Document de Conception Technique — souvent confondu avec le DAT. Le DAT couvre l'architecture, le DCT entre dans le détail d'implémentation. |
| **EDR** | Endpoint Detection and Response — solution de détection et réaction sur poste utilisateur. |
| **JWT** | JSON Web Token — jeton signé utilisé pour authentifier les requêtes API. |
| **MVP** | Minimum Viable Product — version minimale fonctionnelle. |
| **OTP** | One-Time Password — code à usage unique, utilisé ici en TOTP (Time-based) pour la 2FA admin. |
| **ORM** | Object-Relational Mapping — Prisma dans notre cas. |
| **PCI-DSS** | Payment Card Industry Data Security Standard — norme de sécurité pour le traitement des paiements par carte. Stripe permet d'externaliser une grande partie de la conformité. |
| **PR** | Pull Request — proposition de modification soumise pour revue avant fusion sur la branche principale. |
| **REST** | Representational State Transfer — style architectural d'API utilisé ici. |
| **RGPD** | Règlement Général sur la Protection des Données. |
| **SOC** | Security Operations Center — centre de supervision de la sécurité. |
| **SSR / SSG** | Server-Side Rendering / Static Site Generation — modes de rendu de Next.js. |
| **TOTP** | Time-based One-Time Password — algorithme RFC 6238 de génération d'OTP synchronisés sur l'horloge. |
| **XDR** | Extended Detection and Response — convergence de SOC, EDR et autres sources de signal. |

---

# 3. Contexte et objectifs

## 3.1 Contexte client

CYNA est positionnée sur le marché des services managés de cybersécurité, à destination des entreprises de tailles diverses (TPE / PME / ETI). Son offre se structure autour de trois familles :

- **SOC** — supervision continue de l'infrastructure du client par une équipe d'analystes, avec corrélation d'événements et réponse à incident.
- **EDR** — agent de détection installé sur les postes et serveurs, capable d'identifier des comportements anormaux et de remonter des alertes consolidées.
- **XDR** — extension du périmètre de détection au-delà du poste, en intégrant réseau, cloud et applications pour produire une visibilité unifiée.

Ces trois familles sont commercialisées sous forme d'abonnements (mensuels, annuels, par utilisateur ou par device).

## 3.2 Besoin exprimé

Le canal commercial historique de CYNA mobilise principalement le contact direct. Cette modalité présente plusieurs limites identifiées par le client :

- temps long entre la prise de contact et la signature ;
- absence de visibilité publique sur les tarifs et les composants des offres ;
- pas de canal libre-service permettant aux clients de souscrire ou d'ajuster un abonnement existant ;
- charge commerciale élevée pour des besoins simples qui pourraient être traités en ligne.

CYNA a donc demandé la réalisation d'une plateforme e-commerce permettant :

- la présentation publique du catalogue (familles SOC / EDR / XDR, produits associés, tarification claire) ;
- la souscription en ligne avec paiement sécurisé ;
- la gestion d'un compte client (commandes, factures, abonnements en cours, adresses, moyens de paiement) ;
- un support de premier niveau (FAQ, chatbot, contact) ;
- une administration permettant à CYNA de piloter le catalogue, les commandes et les comptes clients.

## 3.3 Objectifs du projet pédagogique

Au-delà de la livraison d'un MVP fonctionnel, le projet poursuit plusieurs objectifs académiques :

- mettre en application les compétences acquises pendant la formation CPI DEV (analyse, conception, développement, gestion de projet) ;
- mettre en œuvre une architecture multi-dépôts cohérente, séparant front, API et mobile ;
- intégrer des composants tiers réels (Stripe pour le paiement, services e-mail, services d'IA générative pour le chatbot) ;
- valider la capacité de l'équipe à livrer en conditions de contrainte de temps et de jalons ;
- produire une documentation technique défendable (DAT, REX, slides, démo).

## 3.4 Écart de stack par rapport au cadrage initial

Le document de cadrage CPI DEV V2-2 mentionne une stack technique de référence :

- frontend Vue.js + Cordova ;
- backend Koa.js ;
- base de données MariaDB.

La réalisation effective s'appuie sur :

- **Next.js 16 + React 19 + Tailwind CSS 4** côté frontend ;
- **NestJS 11** côté backend, avec **Prisma 7** et **PostgreSQL** pour la persistance ;
- **Expo 54 + React Native 0.81** pour le mobile.

Cet écart est documenté et justifié comme suit :

- **Next.js / React** plutôt que Vue / Cordova : maturité de l'écosystème React dans l'équipe, support natif du mobile-first via Tailwind, possibilité d'unifier React (vitrine) et React Native (mobile) en partage de patrons et de composants logiques.
- **NestJS** plutôt que Koa : structuration native par modules, injection de dépendances, intégration TypeScript de premier ordre, outillage Swagger, et écosystème de gardes / pipes / intercepteurs aligné sur les besoins de validation et d'autorisation du projet.
- **Prisma + PostgreSQL** plutôt que MariaDB : Prisma fournit un client typé et des migrations versionnées qui sécurisent l'évolution de schéma. PostgreSQL est compatible avec les besoins d'extensibilité (pg_trgm pour la recherche textuelle, JSONB pour des contenus semi-structurés) et son rendement est aligné sur le projet.
- **Expo** : choix par souci de productivité (publication unifiée iOS / Android / Web depuis une base unique, expo-router calqué sur Next.js).

Cet écart n'efface pas la nécessité de répondre aux exigences fonctionnelles du cadrage, qui sont reprises au § 4 et tracées dans la matrice de conformité de l'annexe A.

## 3.5 Critères de succès

Le projet est réputé réussi si :

- la plateforme couvre l'ensemble des familles fonctionnelles du cahier des charges, à un niveau MVP ;
- une démonstration fonctionnelle est exécutable lors de la soutenance ;
- la documentation (DAT, REX, slides, schémas) est complète et défendable ;
- les écarts par rapport au cadrage initial sont identifiés, justifiés et tracés ;
- les principes de sécurité de base (hachage des mots de passe, gestion des tokens, validation d'entrée, séparation des rôles) sont implémentés.

---

# 4. Périmètre fonctionnel

## 4.1 Vue d'ensemble

Le périmètre fonctionnel se découpe en quatre grands ensembles :

- **Public** — accessible sans authentification : accueil, catalogue, fiches produit, recherche, contact, pages légales.
- **Client authentifié** — accessible après création de compte et connexion : panier, checkout, gestion des commandes, gestion des abonnements, gestion des adresses, gestion des moyens de paiement, support.
- **Administrateur** — accessible avec un compte admin (rôle `ADMIN`) et 2FA TOTP : tableau de bord, gestion du catalogue, gestion des commandes, analytics, gestion des contenus.
- **Système** — non exposé en interface mais nécessaire au fonctionnement : webhooks Stripe, envoi d'e-mails (vérification compte, reset mot de passe), tâches de maintenance.

## 4.2 Modules fonctionnels et statut

| Module | Statut | Notes |
|---|---|---|
| Accueil dynamique (carrousel, blocs texte, mises en avant) | OK | API `/carousel`, `/home-text-blocks`, mises en avant catalogue. |
| Catalogue 3 catégories (SOC / EDR / XDR) | OK | 6 produits dans la base de démonstration, alignés sur le site cyna-it.fr. |
| Recherche catalogue | OK (vitrine) | Recherche locale sur les produits chargés. Possibilité de brancher `GET /products/search` côté API (existant). |
| Fiche produit | OK | Détails, prix, abonnement, ajout au panier. |
| Panier | OK | Persistance côté API pour les utilisateurs connectés ; persistance locale pour les visiteurs. |
| Checkout / paiement carte (Stripe) | OK | Stripe Payment Intent + webhooks. |
| Checkout / paiement PayPal | Partiel / Hors périmètre | Documenté en alternative SDK PayPal Buttons + webhook ; non implémenté dans la version finale. |
| Création de compte + vérification e-mail | OK | Token de vérification stocké, e-mail envoyé via nodemailer. |
| Connexion + JWT | OK | Cookies sécurisés + Authorization header. |
| Mot de passe oublié / reset | OK | Code à usage unique avec expiration. |
| 2FA TOTP (admin) | OK | otplib, QR code généré côté API, validation côté login admin. |
| Espace compte (commandes, factures, abonnements) | OK | Pages `/account/*`. |
| Adresses | OK | Routes API `/addresses`, gestion CRUD côté front. |
| Moyens de paiement | Partiel | Création / suppression depuis Stripe ; UI compte limitée à l'essentiel. |
| Contact (formulaire) | OK | Stockage côté API en `ContactMessage`, statut, source `FORM` ou `CHATBOT`. |
| Support / FAQ | OK | FAQ statique côté vitrine, branchée sur correspondance par mots-clés avant fallback chatbot. |
| Chatbot | Partiel | Module API `chatbot` présent, intégration Google GenAI ; UI vitrine côté support utilise FAQ + matching ; expérience conversationnelle complète non finalisée. |
| Back-office (catalogue, commandes, contenus) | Partiel | Routes API admin présentes ; UI admin limitée — administration via Swagger pour la démo. |
| Analytics admin | Partiel | Module `admin-analytics` exposant des indicateurs de base. |
| Internationalisation FR / EN | Partiel | Système i18n côté vitrine, libellés du shell internationalisés ; certaines pages encore monolingues. |
| Application mobile | Démonstrative | Navigation par onglets, écrans illustratifs, intégration API limitée. |
| Documentation API (Swagger) | OK | Exposée sur `/docs`. |

## 4.3 Hors périmètre explicite

Les éléments suivants sont identifiés comme hors périmètre du projet, soit parce qu'ils étaient explicitement exclus du cadrage initial, soit parce qu'ils dépassent la capacité de livraison sur la durée du projet :

- intégration commerciale réelle avec PayPal en production (un patron d'implémentation est documenté dans `CADRAGE-ALIGNEMENT.md`) ;
- module de facturation comptable (le module `invoices` produit des références d'identification, pas des factures conformes à la réglementation comptable) ;
- déploiement managé en production avec auto-scaling, monitoring centralisé, alerting et plan de reprise d'activité ;
- application mobile productisée avec push notifications, deep links cross-platform et publication sur les stores ;
- conformité PCI-DSS auditée (Stripe assume la majeure partie de cette conformité par délégation) ;
- audit de sécurité externe.

Ces éléments figurent dans la roadmap d'évolution au § 17.

## 4.3.1 Cas d'usage détaillés

Chaque module fonctionnel se déploie sur des cas d'usage concrets. Les paragraphes suivants détaillent les parcours principaux, leurs préconditions, leurs étapes et leurs résultats attendus. Ces cas d'usage servent de référence pour les tests manuels et pour la spécification technique.

### Cas d'usage 1 — Découverte par un visiteur

**Acteur :** visiteur non authentifié.

**Préconditions :** vitrine accessible, base de données peuplée des produits de démonstration.

**Étapes nominales :**

1. le visiteur arrive sur la page d'accueil ;
2. il consulte le carrousel et les produits mis en avant ;
3. il navigue vers la page catalogue ;
4. il filtre par catégorie SOC ;
5. il ouvre la fiche d'un produit ;
6. il consulte les variantes d'abonnement (mensuel, annuel, par utilisateur) ;
7. il revient à l'accueil via le menu.

**Résultat attendu :** parcours fluide, sans erreur console, sans page blanche, sans 404. Temps de réponse perçu inférieur à 1 s sur les transitions principales.

**Variantes :**

- visiteur en mode mobile (viewport ≤ 640 px) — la grille catalogue passe à une colonne, le menu se replie en burger ;
- visiteur déjà visité (panier non vide en LocalStorage) — le badge panier affiche le nombre d'items.

### Cas d'usage 2 — Création de compte et achat

**Acteur :** visiteur souhaitant souscrire.

**Préconditions :** Stripe en mode test, e-mail SMTP configuré.

**Étapes nominales :**

1. le visiteur ajoute un produit au panier ;
2. il clique sur « Passer la commande » ;
3. la vitrine demande la connexion ou la création de compte ;
4. il choisit la création de compte ;
5. il saisit e-mail, mot de passe et nom ;
6. l'API valide les contraintes (e-mail unique, mot de passe ≥ 8 caractères) ;
7. l'API crée l'utilisateur (passwordHash bcrypt) et envoie un e-mail de vérification ;
8. le visiteur clique le lien dans l'e-mail → endpoint `/auth/verify` met `emailVerified = true` ;
9. il revient sur le checkout ;
10. il saisit son adresse de facturation ;
11. il saisit ses informations carte via Stripe Elements ;
12. l'API crée un PaymentIntent côté Stripe et renvoie le `clientSecret` ;
13. la vitrine confirme le paiement avec Stripe ;
14. le webhook `payment_intent.succeeded` arrive côté API ;
15. l'API marque la commande `PAID`, crée l'`Invoice`, active la `Subscription` si applicable, envoie l'e-mail de confirmation ;
16. le visiteur est redirigé sur `/account/orders/<id>` qui affiche la commande.

**Résultat attendu :** paiement validé en mode test, commande visible dans l'espace compte, e-mail reçu, abonnement actif si pertinent.

**Variantes :**

- carte refusée (4000 0000 0000 0002) → message d'erreur explicite, panier conservé ;
- 3D Secure requis (4000 0027 6000 3184) → étape supplémentaire, retour OK ;
- e-mail non vérifié au moment du checkout → blocage avec message explicite ;
- réseau interrompu → l'utilisateur peut retenter ; idempotence assurée par le `clientSecret`.

### Cas d'usage 3 — Réinitialisation de mot de passe

**Acteur :** utilisateur ayant oublié son mot de passe.

**Étapes nominales :**

1. l'utilisateur clique « mot de passe oublié » sur la page de connexion ;
2. il saisit son e-mail ;
3. l'API génère un code OTP, le stocke (`resetPasswordCode`, `resetPasswordExpires` à T+15 min), envoie l'e-mail ;
4. l'utilisateur reçoit le code, le saisit avec un nouveau mot de passe ;
5. l'API valide le code, vérifie l'expiration, met à jour `passwordHash`, invalide le code ;
6. l'utilisateur peut se connecter avec le nouveau mot de passe.

**Résultat attendu :** code valide pendant 15 min, à usage unique. Pas d'énumération possible (le service répond uniformément que « si un compte existe, un e-mail a été envoyé »).

### Cas d'usage 4 — Connexion administrateur avec 2FA

**Acteur :** administrateur CYNA.

**Préconditions :** compte `ADMIN` avec `twoFactorEnabled = true` et `twoFactorSecret` initialisé.

**Étapes nominales :**

1. l'admin saisit e-mail et mot de passe ;
2. l'API valide le mot de passe ;
3. l'API détecte `twoFactorEnabled` et renvoie un challenge 2FA (sans JWT) ;
4. la vitrine affiche le champ TOTP ;
5. l'admin saisit le code à 6 chiffres généré par son authenticator (Google Authenticator, Authy, 1Password) ;
6. l'API vérifie le code via `otplib.authenticator.verify(...)` ;
7. l'API crée le JWT et le renvoie en cookie httpOnly ;
8. l'admin accède au tableau de bord.

**Variantes :**

- code expiré ou invalide → 401, possibilité de retenter ;
- 5 échecs consécutifs → blocage temporaire (à implémenter, voir B-003).

### Cas d'usage 5 — Annulation d'abonnement

**Acteur :** utilisateur authentifié avec un abonnement actif.

**Étapes nominales :**

1. l'utilisateur va sur `/account/subscriptions` ;
2. il clique « Annuler » sur un abonnement ;
3. la vitrine demande confirmation ;
4. l'API appelle `stripe.subscriptions.update(<id>, { cancel_at_period_end: true })` ;
5. l'API met à jour `Subscription.status` et `cancelledAt` ;
6. l'utilisateur voit le statut « annulé en fin de période » avec la date effective.

**Résultat attendu :** plus de prélèvement après la fin de la période en cours. L'abonnement reste accessible jusqu'à expiration.

### Cas d'usage 6 — Support via chatbot et escalade

**Acteur :** utilisateur sur la page support.

**Étapes nominales :**

1. l'utilisateur ouvre le chat depuis la modal support ;
2. il saisit une question ;
3. la vitrine tente d'abord la correspondance via FAQ et `matchPredefinedAnswer` ;
4. si une correspondance forte est trouvée → réponse immédiate sans appel LLM ;
5. sinon → appel à l'API `/chatbot/session/<id>/message`, qui invoque Google GenAI ;
6. la réponse du LLM est rendue dans le chat ;
7. l'utilisateur peut demander une mise en relation humaine → escalade ;
8. l'API marque la session `ESCALATED`, ouvre un `ContactMessage` avec `source = CHATBOT`, notifie un admin par e-mail.

**Résultat attendu :** réponses pertinentes pour les questions fréquentes, escalade fluide pour les cas hors FAQ.

### Cas d'usage 7 — Administration du catalogue

**Acteur :** administrateur authentifié.

**Étapes nominales :**

1. l'admin accède à la documentation Swagger via `/docs` ;
2. il s'authentifie via le bouton Authorize avec son JWT ;
3. il appelle `POST /api/v1/products` avec le payload du nouveau produit ;
4. l'API valide, persiste, renvoie le produit créé ;
5. l'admin teste la visibilité côté vitrine en chargeant `/catalog`.

**Limite actuelle :** UI admin minimale ; l'utilisation passe par Swagger pour la démonstration. Une UI admin complète figure dans la roadmap.

## 4.4 Conformité au cadrage initial

La matrice complète figure en annexe A. Le tableau ci-dessous en donne la synthèse pour les exigences principales du document de cadrage CPI DEV V2-2.

| Exigence cadrage | Statut |
|---|---|
| Plateforme e-commerce mobile-first | OK |
| Identité visuelle cohérente avec cyna-it.fr | OK (palette + logo) |
| Catalogue de 5 à 7 produits phares | OK (6 produits) |
| 3 catégories : SOC / EDR / XDR | OK |
| Chatbot FAQ + saisie libre | Partiel |
| Paiement Stripe | OK |
| Paiement PayPal | Hors périmètre / documenté |
| Back-office | Partiel |
| Base de données relationnelle | OK (PostgreSQL au lieu de MariaDB — écart documenté) |
| Stack Vue / Cordova / Koa | Écart de stack documenté (§ 3.4) |
| Outils collaboratifs (Trello, Teams, GitHub) | OK |
| Documentation et installation | OK (READMEs, DAT, REX) |

---

# 5. Organisation projet

## 5.1 Composition de l'équipe

L'équipe projet est composée de quatre étudiants de la formation CPI DEV :

- **Jessica** — développeuse backend. Authentification, modèle de données, intégration Stripe.
- **Emmanuel** — contributeur front, tests, apprentissage progressif des outils.
- **Théo** — Lead Développeur. Architecture API, structure NestJS, déploiement et hosting du projet.
- **François** — développeur frontend (vitrine `cyna-vitrine`), composants partagés, intégration API côté client, documentation d'alignement (`CADRAGE-ALIGNEMENT.md`), contribution à la démonstration de secours.

L'hétérogénéité de niveau dans l'équipe a influencé l'organisation. Jessica et Emmanuel ont commencé la programmation récemment ; leur contribution a porté sur des modules accessibles, l'apprentissage et la participation aux tests et à la documentation. Cette hétérogénéité est un fait, pas un reproche, et a été prise en compte dans la planification au fil du projet.

## 5.2 Outils

| Catégorie | Outil | Usage |
|---|---|---|
| Communication | Microsoft Teams | Échanges synchrones et asynchrones, partages de fichiers. |
| Suivi de tâches | Trello | Tableau Kanban (Backlog, In Progress, In Review, Done). |
| Versionnement | Git + GitHub | Code, branches par fonctionnalité, pull requests, revue de code. |
| Documentation | Markdown dans le dépôt + fichiers PDF / pptx pour livrables | DAT, REX, slides, READMEs. |
| Maquettage | Figma (en cours d'enrichissement) | Wireframes vitrine et mobile. |
| API documentation | Swagger / OpenAPI 3 (NestJS) | Exposée sur `/docs` côté `cyna-api`. |
| Test paiement | Stripe CLI + comptes de test | Webhooks et flux de paiement en local. |
| Gestion des dépendances | pnpm (préféré) / npm | Verrouillage via `pnpm-lock.yaml` ou `package-lock.json`. |

## 5.3 Méthodologie

L'équipe a fonctionné en sprints courts, avec des points réguliers via Teams et un suivi Trello. Le rituel SCRUM a été présent dans l'esprit (priorisation, jalons, démo intermédiaire en fin de sprint) sans être appliqué dans toute la rigueur du framework — pas de standup quotidien strict, pas de Scrum Master désigné. Les revues de code se faisaient via pull requests sur GitHub, avec validation par au moins un autre membre avant fusion sur la branche principale.

Avec du recul, plusieurs aspects auraient gagné à être plus structurés :

- une definition of done partagée dès le sprint 1 ;
- un jalon explicite « version démontrable de bout en bout » à mi-parcours ;
- un tableau de rôles écrit au sprint 1 ;
- des points de risque trimestriels formalisés.

Ces points figurent dans le REX et dans la roadmap d'amélioration.

## 5.4 Calendrier global

Le projet s'est étalé sur plusieurs mois, structurés en sprints. Les jalons principaux ont été :

- cadrage et conception initiale ;
- mise en place des dépôts et de la stack technique ;
- développement itératif des modules (auth, catalogue, panier, checkout, compte, contact, support, admin) ;
- intégration Stripe et tests de paiement ;
- préparation de la soutenance, des slides, du DAT et des REX ;
- préparation de la démonstration de secours (`backup`).

---

# 6. Architecture générale

## 6.1 Vue d'ensemble

L'architecture du projet est multi-dépôts, séparée en quatre composants logiques : la vitrine web, l'API backend, l'application mobile, et le dépôt de secours pour la démonstration.

```
┌──────────────────┐      ┌───────────────────────┐
│   Utilisateur    │◀────▶│   Vitrine Next.js     │
│   (navigateur)   │      │  (cyna-vitrine)       │
└──────────────────┘      └───────────┬───────────┘
                                      │ HTTPS
                                      │ JSON / JWT
                                      ▼
                          ┌───────────────────────┐
                          │   API NestJS          │
                          │   (cyna-api)          │
                          │   /api/v1/...         │
                          └─────┬─────────┬───────┘
                                │         │
                ┌───────────────▼─┐    ┌──▼───────────────┐
                │  PostgreSQL     │    │  Services tiers  │
                │  (Prisma 7)     │    │  - Stripe        │
                └─────────────────┘    │  - SMTP          │
                                       │  - Google GenAI  │
                                       └──────────────────┘

┌──────────────────┐      ┌───────────────────────┐
│   Utilisateur    │◀────▶│  App Mobile Expo      │
│   (smartphone)   │      │  (Cyna_mobile)        │
└──────────────────┘      └───────────┬───────────┘
                                      │ HTTPS
                                      ▼
                          ┌───────────────────────┐
                          │   API NestJS (idem)   │
                          └───────────────────────┘
```

**Schéma 6.1 — Vue d'ensemble des composants applicatifs et de leurs dépendances.** Les flux entrants utilisateurs traversent la vitrine ou l'application mobile, qui consomment l'API NestJS via HTTPS. L'API persiste l'état dans PostgreSQL (via Prisma) et délègue le paiement, l'envoi d'e-mails et la génération de réponses chatbot à des services tiers.

## 6.2 Responsabilités par composant

### Vitrine `cyna-vitrine`

- rendu des pages publiques et utilisateur (Next.js App Router, RSC + composants client) ;
- consommation de l'API REST `cyna-api` via `axios` et la couche `services/` ;
- gestion d'état côté client (panier visiteur, session, contexte i18n, contexte d'authentification) ;
- intégration Stripe Elements pour la collecte des moyens de paiement ;
- gestion du thème sombre forcé (cohérence visuelle dans le domaine cyber) ;
- internationalisation FR / EN sur le shell.

### API `cyna-api`

- exposition des routes REST sous le préfixe `/api`, versionnées via `VersioningType.URI` ;
- documentation interactive Swagger sur `/docs` ;
- authentification et autorisation (JWT, gardes NestJS, rôles `USER` / `ADMIN`, 2FA TOTP pour l'admin) ;
- accès base de données via Prisma ;
- intégration Stripe (création de PaymentIntents, webhooks de confirmation) ;
- envoi d'e-mails transactionnels via nodemailer ;
- exposition d'un module `chatbot` interfaçant Google GenAI.

### Application mobile `Cyna_mobile`

- navigation par onglets (`expo-router`) ;
- écrans illustratifs s'appuyant sur l'API ;
- intégration limitée — démonstrative et non productisée à ce jour.

### Dépôt `backup`

- copie de secours du couple vitrine + API préparée à J-3 de la soutenance ;
- environnement maîtrisé pour la démonstration, configuration `.env` dédiée, parcours minimal validé en mode test Stripe.

## 6.3 Choix architecturaux structurants

### 6.3.1 Multi-dépôts plutôt que monorepo

L'arbitrage entre monorepo (un dépôt unique avec workspaces) et multi-dépôts a penché en faveur du multi-dépôts pour des raisons opérationnelles :

- chaque dépôt a un cycle de déploiement autonome ;
- les permissions GitHub sont segmentées par dépôt ;
- l'apprentissage de la stack par les contributeurs débutants est plus simple sur des dépôts plus petits que sur un monorepo avec workspaces et résolutions croisées.

L'inconvénient principal est la duplication potentielle de types et la nécessité d'une discipline manuelle pour synchroniser les contrats entre la vitrine et l'API. Cette dette est identifiée et figure dans la roadmap (§ 17).

### 6.3.2 API REST plutôt que GraphQL

REST a été préféré à GraphQL pour les raisons suivantes :

- maturité plus grande de l'équipe sur REST ;
- intégration immédiate avec Swagger et NestJS sans tooling complémentaire ;
- adéquation au périmètre fonctionnel (peu d'agrégations transverses qui justifieraient GraphQL).

GraphQL reste un candidat pertinent en évolution.

### 6.3.3 PostgreSQL plutôt que MariaDB

PostgreSQL a été préféré à MariaDB (mentionnée dans le cadrage initial) pour les raisons suivantes :

- support natif des extensions utiles à un e-commerce (pg_trgm pour la recherche textuelle, JSONB pour des configurations semi-structurées) ;
- intégration plus directe avec Prisma ;
- familiarité plus forte de l'équipe avec PostgreSQL.

Cet écart est documenté en annexe A (matrice de conformité).

### 6.3.4 Stripe Server-side plutôt que Checkout hébergé

L'intégration Stripe a été conçue côté serveur (création de PaymentIntents, gestion de webhooks) plutôt qu'avec un Checkout hébergé. Ce choix permet :

- un contrôle plus fin du parcours utilisateur ;
- l'intégration de Stripe Elements dans la vitrine pour une expérience cohérente ;
- la possibilité d'évolution vers d'autres moyens de paiement (Apple Pay, Google Pay, Link) sans réécrire le parcours.

L'inconvénient est un poids de conformité PCI-DSS plus élevé qu'un Checkout hébergé pur. Stripe assume la majeure partie de la conformité dès lors que la collecte des données de carte passe par Stripe Elements (les données carte ne transitent pas par notre serveur).

### 6.3.5 Thème sombre forcé

La vitrine est volontairement servie en thème sombre uniquement. Ce choix d'identité s'appuie sur les codes visuels du domaine cyber (sobriété, contraste, sérieux). Le système `next-themes` est en place mais le thème clair n'est pas activé. Cette décision est documentée dans le code (`forcedTheme="dark"`) et dans `CADRAGE-ALIGNEMENT.md`.

---

# 7. Frontend — `cyna-vitrine`

## 7.1 Stack technique

| Couche | Technologie | Version |
|---|---|---|
| Framework | Next.js | 16.0.x |
| Langage | TypeScript | 5.x |
| UI core | React | 19.2 |
| Styling | Tailwind CSS | 4.x |
| Composants accessibles | @headlessui/react | 2.x |
| Composants accessibles | @radix-ui/react-popover | 1.x |
| Animation | framer-motion | 12.x |
| Iconographie | Heroicons + Lucide React | 2.x / latest |
| Themes | next-themes | 0.x (forcedTheme="dark") |
| HTTP | axios | 1.x |
| Cookies | js-cookie | 3.x |
| Paiement | @stripe/stripe-js + @stripe/react-stripe-js | latest |
| Outillage | ESLint, eslint-config-next | 9.x / 16.x |
| Déploiement | @netlify/plugin-nextjs (option) | 5.x |

## 7.2 Structure du dépôt

```
cyna-vitrine/
├── public/                      # assets statiques
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── account/             # espace compte (commandes, factures, profil)
│   │   ├── api/                 # routes API internes (proxy / SSR helpers)
│   │   ├── auth/                # login, signup, vérif email
│   │   ├── cart/                # panier
│   │   ├── catalog/             # liste produits + filtres
│   │   ├── cgu/                 # conditions générales d'utilisation
│   │   ├── checkout/            # paiement
│   │   ├── contact/             # formulaire de contact
│   │   ├── dashboard/           # tableau de bord (selon rôle)
│   │   ├── forgot-password/     # reset mot de passe
│   │   ├── mentions-legales/    # mentions légales
│   │   ├── product/             # fiche produit
│   │   ├── sav/                 # service après-vente
│   │   ├── search/              # recherche
│   │   ├── support/             # FAQ + chatbot
│   │   ├── globals.css          # variables Tailwind + tokens design
│   │   ├── layout.tsx           # layout racine (providers, header/footer)
│   │   └── page.tsx             # page d'accueil
│   ├── components/
│   │   ├── home/                # composants spécifiques accueil
│   │   ├── legal/               # shells pages légales
│   │   ├── products/            # composants catalogue / fiche
│   │   ├── ui/                  # primitives partagées
│   │   ├── AccountDashboard.tsx
│   │   ├── AppFooter.tsx
│   │   ├── AppHeader.tsx
│   │   ├── AppSearch.tsx
│   │   ├── CatalogSuspenseFallback.tsx
│   │   ├── CyberNewsFeed.tsx
│   │   ├── CynaLogo.tsx
│   │   ├── DashboardMockup.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── LegalPageShell.tsx
│   │   ├── Providers.tsx
│   │   └── ThreatFeed.tsx
│   ├── context/                 # React Context (auth, panier, i18n)
│   ├── hooks/                   # hooks custom
│   ├── i18n/                    # libellés FR / EN, helpers
│   ├── layout/                  # wrappers de layout
│   ├── lib/                     # utilitaires (FAQ, helpers, geminiService)
│   ├── services/                # client API
│   ├── types/                   # types partagés
│   └── constant.ts              # constantes (produits, catégories)
├── CADRAGE-ALIGNEMENT.md        # matrice exigences ↔ code
├── README.md
├── TEST_ACCOUNTS.md             # comptes de test
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

## 7.3 Routage et rendu

L'App Router de Next.js est utilisé. Les pages publiques (accueil, catalogue, fiche produit, contact, légal) s'appuient sur un mélange de Server Components et de Client Components selon les besoins d'interactivité. L'authentification, le panier, le checkout et les pages compte fonctionnent essentiellement avec des Client Components, en raison de la nécessité d'accéder à l'état côté client (cookies de session, contexte d'authentification, intégration Stripe Elements).

Le préfixe par défaut est `/`. Les pages internes admin / dashboard sont gardées par un check de rôle côté client (avec un fallback côté serveur quand pertinent).

## 7.4 Gestion d'état

L'état applicatif est segmenté en plusieurs contextes :

- **AuthContext** — utilisateur courant, token JWT (stocké en cookie httpOnly côté API et en cookie lisible côté client pour la lecture du rôle), expiration.
- **CartContext** — panier visiteur (LocalStorage) ; pour les utilisateurs connectés, panier persisté côté API et synchronisé.
- **I18nContext** — langue courante et libellés.
- **ThemeContext** — fourni par `next-themes`, forcé sur `dark`.

Les contextes sont enveloppés dans `Providers.tsx` au niveau du layout racine. Aucun store global type Redux n'a été introduit — la complexité est restée gérable avec Context + hooks.

## 7.5 Identité visuelle et design system

Variables Tailwind CSS personnalisées dans `globals.css`. Le palette repose sur :

- **fond** sombre (proche `#0b0b14`) ;
- **violet / magenta** comme couleur principale (`--cyna-violet`, `--cyna-magenta`) ;
- **dégradé** sur le logo (`CynaLogo.tsx`) — un C stylisé en dégradé violet → magenta.

L'identité s'inspire du site `cyna-it.fr` sans en être une copie. Le design tokens sont centralisés dans `globals.css` et consommés via Tailwind utility classes ou CSS custom properties.

Les composants visuels critiques sont :

- **AppHeader** — en-tête sticky, logo, navigation principale, barre de recherche (`AppSearch`), commutateur de langue, accès compte ;
- **AppFooter** — pied de page, liens secondaires, mentions légales, ouvrant les pages CGU / mentions légales ;
- **CynaLogo** — composant SVG paramétrable, utilisé en différentes tailles ;
- **CatalogSuspenseFallback** — squelette de chargement aligné sur le rendu réel du catalogue ;
- **CyberNewsFeed / ThreatFeed** — blocs d'actualités cyber mockés, donnant à l'accueil une coloration domaine ;
- **DashboardMockup** — illustration visuelle du tableau de bord pour la page d'accueil.

## 7.6 Composants par page

### 7.6.1 Accueil (`/`)

Layout en sections empilées :

- bannière d'introduction avec carrousel (alimenté par l'API `/carousel`) ;
- présentation des trois familles SOC / EDR / XDR ;
- mises en avant produits (alimentées par l'API `/products` filtrés sur `featured`) ;
- bloc d'actualités cyber (mocké pour la démo) ;
- bloc d'aperçu du tableau de bord (`DashboardMockup`) ;
- appels à l'action vers le catalogue et le contact.

### 7.6.2 Catalogue (`/catalog`)

- chargement de la liste complète via `GET /api/v1/products` ;
- filtres par catégorie (Tous, SOC, EDR, XDR) ;
- tri par défaut alphabétique ; tri par prix possible ;
- pagination prête à brancher (l'API supporte `?page` et `?limit`) — non activée en démo car le catalogue tient en une page ;
- responsive mobile-first : grille 1 colonne mobile, 2 colonnes tablette, 3 colonnes desktop.

### 7.6.3 Fiche produit (`/product/[slug]`)

- chargement par slug ;
- bloc visuel + description ;
- variantes d'abonnement (mensuel / annuel / par utilisateur) selon le `BillingCycle` du produit ;
- bouton ajout au panier ;
- bloc « produits associés » de la même catégorie.

### 7.6.4 Recherche (`/search?q=`)

- input dans `AppHeader` ;
- recherche locale sur les produits déjà chargés en page d'accueil et catalogue (cache léger côté contexte) ;
- option API `GET /products/search?q=...` documentée et prête à être branchée pour un catalogue plus volumineux.

### 7.6.5 Panier (`/cart`)

- liste des lignes ;
- modification de quantité ;
- suppression d'une ligne ;
- récapitulatif total ;
- bouton « passer la commande » → `/checkout`.

### 7.6.6 Checkout (`/checkout`)

- récapitulatif ;
- formulaire d'adresse de facturation ;
- intégration Stripe Elements pour la saisie de la carte ;
- création du Payment Intent côté API ;
- confirmation côté client puis redirection sur `/account/orders/<id>`.

### 7.6.7 Compte (`/account/*`)

- profil ;
- commandes ;
- factures (références) ;
- abonnements actifs ;
- adresses ;
- moyens de paiement (UI minimale, gestion serveur via Stripe).

### 7.6.8 Auth (`/auth/login`, `/auth/signup`, `/forgot-password`)

- formulaires validés côté client (zod-style via class-validator côté serveur) ;
- création de compte → e-mail de vérification ;
- connexion → JWT côté API stocké en cookie ;
- mot de passe oublié → code à usage unique envoyé par e-mail.

### 7.6.9 Contact (`/contact`)

- formulaire libre (nom, e-mail, objet, message) ;
- envoi vers `POST /contact` côté API ;
- accusé de réception affiché ;
- côté API, stockage dans `ContactMessage` avec `source = FORM`.

### 7.6.10 Support (`/support`)

- FAQ statique côté front (`lib/supportFaq.ts`) ;
- modal de chat avec correspondance par mots-clés (`matchPredefinedAnswer`) avant fallback ;
- option fallback Google GenAI via le module `chatbot` côté API.

### 7.6.11 Pages légales (`/cgu`, `/mentions-legales`)

- shell partagé `LegalPageShell.tsx` ;
- contenu Markdown rendu via composant ;
- accès depuis le footer.

## 7.7 Internationalisation

Le système i18n est porté par un `I18nProvider` côté contexte React. Les libellés sont stockés en JSON-like (clé → valeur) dans le dossier `i18n/`, structurés par langue (`fr`, `en`). L'attribut `lang` du `<html>` est synchronisé à la langue active pour aider les outils d'accessibilité.

Le shell (header, footer, recherche, carrousel, libellés boutons) est traduit. Certaines pages applicatives (compte, checkout) sont encore monolingues — c'est un point d'amélioration documenté.

## 7.8 Accessibilité

Les efforts d'accessibilité portent sur :

- les régions ARIA et `aria-live` sur le carrousel, masquage des slides inactives ;
- les formulaires (contact, login, signup) : `htmlFor`, `aria-invalid`, `role="alert"` sur les messages d'erreur ;
- les modales : `role="dialog"`, `aria-modal`, libellés explicites des boutons de fermeture ;
- contrastes vérifiés dans le palette violet / magenta sur fond sombre.

L'audit complet (WCAG AA) n'a pas été conduit ; il figure dans la roadmap.

## 7.9 Sécurité côté front

- stockage du JWT en cookie httpOnly côté API ; la lecture côté front se limite au rôle (cookie lisible séparé) pour les routages conditionnels ;
- validations d'entrée (longueur, format) côté client en complément de la validation serveur ;
- sanitization des contenus rendus depuis l'API (échappement automatique React) ;
- pas de stockage de données sensibles côté LocalStorage.

## 7.9.1 Stratégie de design system

Le design system de la vitrine n'est pas un système indépendant publié séparément. Il est embarqué dans le dépôt sous forme de tokens Tailwind, de composants React partagés et de conventions d'usage. Ce choix se justifie pour un projet de cette taille :

- **simplicité** — pas de versionnement croisé entre un paquet design system et la vitrine ;
- **rapidité d'évolution** — un changement de token est immédiatement répercuté ;
- **proximité du code** — le composant et son token vivent au même endroit, ce qui réduit la dérive.

L'inconvénient est l'impossibilité de partager le design system avec une autre application sans copier le code. Pour le périmètre actuel (une vitrine + un mobile démonstrateur), c'est acceptable. Si la cible évoluait vers plusieurs applications front (back-office, mobile productisé), un paquet partagé deviendrait pertinent.

### Tokens

Les tokens sont définis dans `globals.css` via des variables CSS et exposés à Tailwind via `tailwind.config`. Catégories :

- **couleurs** — `--cyna-bg`, `--cyna-bg-elevated`, `--cyna-violet`, `--cyna-magenta`, `--cyna-text`, `--cyna-text-muted`, `--cyna-border`, `--cyna-success`, `--cyna-warning`, `--cyna-danger` ;
- **typographies** — police principale (sans-serif moderne), tailles `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `display` ;
- **espacements** — échelle Tailwind par défaut, complétée par quelques tailles métier (`section`, `block`, `inline`) ;
- **rayons** — `rounded-sm`, `rounded`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full` ;
- **ombres** — `shadow-soft`, `shadow-medium`, `shadow-glow` (effet violet diffus utilisé sur les hover des CTAs) ;
- **animations** — durées par défaut, courbes (`ease-out`, `ease-in-out`), keyframes spécifiques pour les transitions de modal et de drawer.

### Composants primitifs

Sous `components/ui/`, les composants primitifs forment la base du design system local :

- **Button** — variantes `primary`, `secondary`, `ghost`, `danger` ; tailles `sm`, `md`, `lg` ; états `loading`, `disabled` ; `as` polymorphique pour rendu en `<a>` ou `<button>` ;
- **Input** — text, number, email, password ; états `default`, `focus`, `error`, `disabled` ; aria-* corrects ;
- **Select** — basé sur Radix Popover pour l'accessibilité clavier ;
- **Modal** — `role="dialog"`, focus trap, fermeture sur Escape, animation framer-motion ;
- **Toast** — système d'annonces non bloquantes, queue limitée à 3, auto-dismiss après 5 s ;
- **Skeleton** — squelettes de chargement alignés sur le rendu réel ;
- **Tabs** — accessibilité clavier complète, variant horizontal et vertical ;
- **Card** — surface élevée, padding cohérent, hover state.

### Composants métier

Sous `components/`, les composants métier consomment les primitifs :

- **ProductCard** — affichage catalogue, image, badge catégorie, prix « à partir de », CTA ajout panier ;
- **CategoryFilter** — filtre catalogue, pills cliquables avec compteur ;
- **CartLineItem** — ligne panier, quantité éditable, prix unitaire, prix total, bouton suppression ;
- **OrderSummary** — récap commande dans le checkout ;
- **AddressForm** — formulaire d'adresse avec validation (autocomplete, validation pays, code postal) ;
- **AccountMenu** — menu utilisateur connecté ;
- **AdminTable** — tableau admin réutilisable (peuplé via `props`).

### Conventions

- les composants UI primitifs ne portent pas de logique métier ;
- les composants métier consomment les primitifs et ajoutent la logique ;
- les pages assemblent les composants métier et orchestrent les appels API ;
- pas de styles inline arbitraires — toujours via tokens ou Tailwind utility classes ;
- pas de couleurs hex en dur dans les composants (uniquement via variables CSS) ;
- une variante = une prop (`variant`, `size`) plutôt qu'une combinaison de classes hard-codées.

## 7.10 Performance et SEO

- pages publiques rendues en SSR ou SSG quand les données le permettent ;
- pré-chargement des données catalogue en page d'accueil (cache au niveau contexte) pour éviter une re-récupération en page catalogue ;
- métadonnées Open Graph et Twitter sur les pages clés ;
- sitemap et robots.txt exposés (à finaliser pour la mise en production).

---

# 8. Backend / API — `cyna-api`

## 8.1 Stack technique

| Couche | Technologie | Version |
|---|---|---|
| Framework | NestJS | 11.x |
| Langage | TypeScript | 5.x |
| ORM | Prisma | 7.x |
| Base de données | PostgreSQL | 14+ |
| HTTP | @nestjs/platform-express | 11.x |
| Validation | class-validator + class-transformer | latest |
| Auth | @nestjs/jwt + passport-jwt | latest |
| Hash | bcrypt + bcryptjs | latest |
| OTP / 2FA | otplib | 13.x |
| E-mail | nodemailer | 8.x |
| Paiement | stripe (Server SDK) | 20.x |
| IA | @google/genai | 1.x |
| Documentation | @nestjs/swagger (OpenAPI 3) | 11.x |
| Tests | jest + supertest | 29.x / 7.x |

## 8.2 Bootstrap

`src/main.ts` expose les éléments suivants :

- préfixe global `/api` ;
- versioning par URI (`/api/v1/...`) ;
- pipe de validation globale avec `whitelist`, `forbidNonWhitelisted`, `transform` ;
- CORS paramétré sur `FRONTEND_URL` (fallback `*` en local) avec `credentials: true` ;
- documentation Swagger sur `/docs`, avec `addBearerAuth()` et un schéma OpenAPI exposé en JSON ;
- écoute par défaut sur le port `process.env.PORT` (`3000` par défaut).

## 8.3 Modules

L'API est organisée par modules métier sous `src/`.

| Module | Rôle |
|---|---|
| `addresses` | CRUD adresses utilisateur. |
| `admin-analytics` | indicateurs agrégés réservés au rôle ADMIN. |
| `auth` | inscription, connexion, vérification e-mail, reset mot de passe, 2FA TOTP. |
| `carousel` | contenu du carrousel d'accueil. |
| `cart` | gestion du panier persistant pour les utilisateurs connectés. |
| `categories` | familles SOC / EDR / XDR et hiérarchies éventuelles. |
| `chatbot` | sessions de chat, intégration Google GenAI, escalade vers contact humain. |
| `common` | helpers transverses (pipes, gardes, intercepteurs, types). |
| `contact` | formulaire de contact (`ContactSource = FORM`). |
| `home-text-blocks` | contenus textuels paramétrables affichés en page d'accueil. |
| `invoices` | génération et stockage de références de facture. |
| `orders` | commandes utilisateur, statuts (`PENDING`, `PAID`, `ACTIVE`, `CANCELLED`, `REFUNDED`). |
| `payment-methods` | moyens de paiement enregistrés par l'utilisateur (référencés sur Stripe). |
| `prisma` | provider du `PrismaClient` pour injection transverse. |
| `products` | catalogue produits, filtres, recherche. |
| `subscription-plans` | plans d'abonnement disponibles par produit (cycles `MONTHLY`, `YEARLY`, `PER_USER`, `PER_DEVICE`). |
| `subscriptions` | abonnements souscrits par les utilisateurs et leur cycle de vie. |
| `users` | gestion des utilisateurs (CRUD admin, profil utilisateur). |
| `v1/auth` | extension des routes auth en versioning v1. |
| `v1/payement` | endpoints de paiement (Stripe). |

## 8.4 Conventions de routage

- préfixe global `/api` ;
- versioning par URI : `/api/v1/<resource>` ;
- naming kebab-case côté URI, PascalCase côté contrôleur ;
- gardes (`@UseGuards`) appliquées en premier sur le contrôleur, puis affinées par méthode ;
- DTOs validés via class-validator déclarés dans `dto/` à côté du contrôleur ;
- réponses normalisées : un objet ou un tableau d'objets Prisma, avec `select` explicite pour éviter les fuites de champs sensibles (`passwordHash`, `twoFactorSecret`).

## 8.5 Validation et erreurs

Le pipe global de validation rejette toute requête contenant des champs non listés dans le DTO (`forbidNonWhitelisted`). Les erreurs métier remontent en `HttpException` typées (`UnauthorizedException`, `ForbiddenException`, `NotFoundException`, `ConflictException`, `BadRequestException`).

Le filtre d'exceptions global homogénéise le format de réponse :

```json
{
  "statusCode": 400,
  "message": "...",
  "error": "Bad Request"
}
```

## 8.6 Couche données via Prisma

Le `PrismaService` est un `Injectable` qui étend `PrismaClient` et appelle `$connect()` au `onModuleInit()`. Il est exposé par le `PrismaModule` et injecté dans les services métier.

Les requêtes sensibles utilisent `select` explicite pour éviter de remonter des champs comme `passwordHash`, `twoFactorSecret`, `emailVerificationToken`, `resetPasswordCode`. Les transactions multi-modèles utilisent `prisma.$transaction([...])`.

## 8.7 Documentation Swagger

Tous les contrôleurs sont annotés `@ApiTags(...)`, `@ApiOperation(...)`, `@ApiResponse(...)`. Les DTOs sont annotés `@ApiProperty(...)`. Le schéma OpenAPI 3 est exposé sur `/docs/json` et l'UI interactive sur `/docs`. La sécurité Bearer est déclarée via `addBearerAuth()` dans le bootstrap.

Cette documentation Swagger sert également de support de tests manuels en démonstration et permet à un développeur tiers de comprendre l'API sans accès au code.

## 8.8 Patterns architecturaux côté API

### 8.8.1 Modules autonomes par domaine

Chaque module métier (`auth`, `products`, `orders`, `payement`, `chatbot`, etc.) est autonome. Il porte son contrôleur, son service, ses DTOs et ses tests. Il ne consomme directement les autres modules qu'à travers leurs services exposés. Cette autonomie permet :

- une compréhension locale de chaque module sans charger tout le code ;
- des tests unitaires plus simples (mocking ciblé) ;
- une évolution indépendante (un changement dans `chatbot` ne casse pas `orders`) ;
- une éventuelle migration future vers des microservices, si la charge le justifiait — non envisagée à ce jour.

### 8.8.2 DTO d'entrée et types de sortie

Convention :

- toute entrée HTTP (body, query, params) passe par un DTO décoré avec class-validator ;
- toute sortie est une projection explicite (via `select` Prisma ou un mapper) qui ne fuit jamais de champs sensibles ;
- pas de retour direct d'une entité Prisma sans projection.

Exemple type pour le service auth :

```ts
// auth/dto/sign-up.dto.ts
export class SignUpDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @MinLength(1)
  firstName!: string;

  @IsString()
  @MinLength(1)
  lastName!: string;
}

// auth/types/auth-response.ts
export type AuthResponse = {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'USER' | 'ADMIN';
  };
  accessToken?: string;
  challenge?: '2FA_REQUIRED';
};
```

### 8.8.3 Gardes et autorisation

Les gardes NestJS sont organisées en couche :

- `JwtAuthGuard` — vérifie la présence et la validité d'un JWT ;
- `RolesGuard` — lit le décorateur `@Roles('ADMIN')` et vérifie que `request.user.role` matche ;
- `OwnershipGuard` — vérifie que l'utilisateur courant est propriétaire de la ressource demandée (par exemple sur `/orders/:id` pour empêcher un USER de lire la commande d'un autre).

Composition typique sur un contrôleur :

```ts
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.ordersService.listForUser(user.id);
  }

  @UseGuards(OwnershipGuard)
  @Get(':id')
  one(@Param('id') id: number) {
    return this.ordersService.findOne(id);
  }
}
```

### 8.8.4 Gestion des erreurs

Convention :

- erreurs métier prévues → `HttpException` typées (`BadRequestException`, `NotFoundException`, etc.) ;
- erreurs imprévues → propagation vers le filtre global, qui répond `500` avec un message générique en production et la trace en développement ;
- aucun secret ni token ne fuit dans une réponse d'erreur ;
- toutes les erreurs sont logguées côté serveur avec le contexte (route, userId si connecté, requestId).

### 8.8.5 Logging

Logger NestJS interne par module. Le format de production cible est JSON structuré, prêt à être consommé par un agrégateur (Loki, ELK, Datadog). Les champs minimum :

- `timestamp` ISO ;
- `level` (`info`, `warn`, `error`) ;
- `message` ;
- `context` (nom du module ou du contrôleur) ;
- `requestId` (généré par un middleware) ;
- `userId` si applicable ;
- `event` — nom canonique pour les événements de sécurité (`auth.login.success`, etc.).

### 8.8.6 Idempotence

Les opérations potentiellement dupliquées par le client ou par les retries Stripe doivent être idempotentes :

- les webhooks Stripe stockent l'`event.id` traité ; un retry est ignoré ;
- la création d'une commande via `clientSecret` Stripe est idempotente côté Stripe ;
- les créations de compte gèrent gracieusement la collision sur l'e-mail (`409 Conflict` plutôt que `500`).

### 8.8.7 Versioning d'API

Le versioning par URI (`/api/v1/...`) permet d'introduire des changements breaking sans casser les clients existants. Convention :

- une nouvelle version (`v2`) n'est introduite qu'en cas de breaking change réel ;
- les nouvelles routes non-breaking sont ajoutées dans `v1` ;
- les anciennes routes obsolètes sont marquées `@deprecated` dans Swagger pendant 6 mois minimum avant retrait.

### 8.8.8 Configuration

`@nestjs/config` charge `.env` au démarrage. Validation via Joi ou class-validator pour rejeter une configuration incomplète au boot plutôt qu'à l'usage. Aucune valeur de production en dur dans le code.

### 8.8.9 Test pyramid

La pyramide de tests cible :

- 70 % de tests unitaires (services, helpers, validateurs) ;
- 20 % de tests d'intégration légers (`Test.createTestingModule`, mocks Prisma) ;
- 10 % de tests e2e (à mettre en place — voir roadmap).

À ce stade du projet, la couverture unitaire est partielle et l'e2e absent.

---

# 9. Base de données

## 9.1 Choix du SGBD

PostgreSQL 14+ est utilisé. Justifications au § 3.4 et § 6.3.3.

## 9.2 Vue d'ensemble du schéma

Le modèle de données s'organise autour de huit familles d'entités :

- **utilisateurs** — `User`, `Session`, `PasswordResetToken` ;
- **adresses et moyens de paiement** — `Address`, `PaymentMethod` ;
- **catalogue** — `Category`, `Product`, `SubscriptionPlan` ;
- **panier et commandes** — `Cart`, `CartItem`, `Order`, `OrderItem` ;
- **abonnements et factures** — `Subscription`, `Invoice` ;
- **contenus** — `Carousel`, `HomeTextBlock` ;
- **support et contact** — `ContactMessage`, `ChatbotSession`, `ChatbotMessage` ;
- **système** — paramètres, configuration.

## 9.3 Énumérations

Le schéma définit plusieurs enums (extrait de `prisma/schema.prisma`) :

- `Role` — `USER`, `ADMIN` ;
- `OrderStatus` — `PENDING`, `PAID`, `ACTIVE`, `CANCELLED`, `REFUNDED` ;
- `BillingCycle` — `MONTHLY`, `YEARLY`, `PER_USER`, `PER_DEVICE` ;
- `SubscriptionStatus` — `ACTIVE`, `CANCELLED`, `EXPIRED`, `PAUSED` ;
- `ContactStatus` — `NEW`, `READ`, `REPLIED`, `CLOSED` ;
- `ContactSource` — `FORM`, `CHATBOT` ;
- `ChatbotSessionStatus` — `OPEN`, `ESCALATED`, `CLOSED` ;
- `ChatbotSender` — `USER`, `BOT`, `AGENT`.

## 9.4 Modèles principaux

### `User`

Champs clés : `id`, `email` (unique), `passwordHash`, `emailVerified`, `emailVerificationToken`, `role` (`USER`/`ADMIN`), `twoFactorEnabled`, `twoFactorSecret`, `lastLoginAt`, `createdAt`, `updatedAt`, `resetPasswordCode`, `resetPasswordExpires`, `stripeCustomerId` (unique).

Relations : `Session[]`, `PasswordResetToken[]`, `Address[]`, `PaymentMethod[]`, `Cart[]`, `Order[]`, `Subscription[]`, `Invoice[]`, `ContactMessage[]`, `ChatbotSession[]`.

### `Product`

Champs : `id`, `slug` (unique), `name`, `category` (relation), `description`, `priceFrom`, `featured`, `tags`, `image`, `createdAt`, `updatedAt`.

Relations : `Category`, `SubscriptionPlan[]`, `OrderItem[]`, `CartItem[]`.

### `Order`

Champs : `id`, `userId`, `status` (`OrderStatus`), `totalAmount`, `currency`, `stripePaymentIntentId`, `paidAt`, `createdAt`, `updatedAt`.

Relations : `User`, `OrderItem[]`, `Invoice`.

### `Subscription`

Champs : `id`, `userId`, `planId`, `status` (`SubscriptionStatus`), `startDate`, `nextRenewalAt`, `cancelledAt`, `stripeSubscriptionId`.

Relations : `User`, `SubscriptionPlan`.

### `ContactMessage`

Champs : `id`, `userId?`, `name`, `email`, `subject`, `message`, `status` (`ContactStatus`), `source` (`ContactSource`), `createdAt`.

### `ChatbotSession` + `ChatbotMessage`

Modèle conversationnel : une session par utilisateur (ou anonyme), des messages typés `USER` / `BOT` / `AGENT`, statut `OPEN` / `ESCALATED` / `CLOSED`.

## 9.5 Migrations

Le dossier `prisma/migrations/` contient 4 migrations versionnées. Chaque migration est appliquée via `prisma migrate deploy` en production et `prisma migrate dev` en développement. Le seed initial est dans `prisma/seed.ts` (alimentation des catégories, des produits de démonstration, des plans d'abonnement et d'un compte admin de test).

## 9.6 Index et performance

Index principaux :

- `User.email` unique ;
- `User.stripeCustomerId` unique ;
- `Product.slug` unique ;
- `Session.token` unique ;
- index secondaires sur `Order.userId`, `Subscription.userId`, `ContactMessage.userId`, `Cart.userId` pour les requêtes utilisateur.

Pour la recherche textuelle catalogue, l'extension `pg_trgm` est documentée comme prêt-à-activer (`CREATE EXTENSION IF NOT EXISTS pg_trgm`). Elle n'est pas activée par défaut ; le catalogue de démonstration est suffisamment petit pour fonctionner sans.

## 9.7 Sauvegardes

En contexte projet pédagogique, les sauvegardes sont assurées par :

- l'export Prisma (`prisma db pull` côté schéma, dump SQL côté données) avant chaque migration sensible ;
- les migrations versionnées qui permettent de reconstruire le schéma à n'importe quel point.

En production réelle, un plan de sauvegarde managé (point-in-time recovery, snapshots quotidiens, rétention 30 jours) serait à mettre en place.

---

# 10. Sécurité

## 10.1 Authentification

L'authentification s'appuie sur JWT signé par une clé secrète stockée en variable d'environnement (`JWT_SECRET`). Le flux est le suivant :

1. l'utilisateur soumet email + mot de passe sur `POST /api/v1/auth/login` ;
2. le serveur vérifie l'existence de l'utilisateur, compare le mot de passe avec `bcrypt.compare()` ;
3. si l'utilisateur a `twoFactorEnabled = true`, le serveur retourne un challenge 2FA ; sinon, il retourne un JWT signé contenant `{ sub, email, role }`, valable 24 h ;
4. côté front, le JWT est stocké en cookie httpOnly (impossible à lire par JavaScript) ; un cookie `role` lisible est posé en parallèle pour permettre les routages conditionnels côté client.

## 10.2 Hachage des mots de passe

Les mots de passe sont hachés avec `bcrypt` (round 10 par défaut). Aucun mot de passe en clair n'est jamais stocké ni journalisé. Les rotations de mots de passe (reset, changement) re-hachent systématiquement.

## 10.3 Validation des entrées

Le pipe global de validation rejette tout champ non déclaré dans le DTO. Les contraintes (`@IsEmail`, `@MinLength`, `@IsString`, `@IsInt`, `@Min`, `@Max`) sont appliquées côté DTO. Les inputs utilisateur sont également échappés par le rendu React côté front (sortie HTML automatiquement neutralisée).

## 10.4 Protection contre les injections SQL

Prisma génère du SQL paramétré ; aucune concaténation de chaînes n'est utilisée pour construire des requêtes SQL. Aucune route n'expose de SQL brut à l'utilisateur.

## 10.5 Gestion des rôles

Le rôle est porté par l'enum `Role` dans Prisma (`USER`, `ADMIN`). La garde `RolesGuard` côté NestJS contrôle l'accès aux routes annotées `@Roles('ADMIN')`. Les routes admin ne sont jamais accessibles à un utilisateur `USER`.

## 10.6 2FA TOTP

Le 2FA est implémenté pour les comptes admin via `otplib`. Le flux :

1. l'admin active la 2FA depuis son profil → le serveur génère un secret TOTP, le stocke (`twoFactorSecret`) et renvoie un secret + URL d'auth (otpauth://) ;
2. le front affiche un QR code à scanner avec un app authenticator ;
3. l'admin saisit un code généré pour confirmer l'activation ;
4. à chaque connexion, après validation mot de passe, un code TOTP est demandé.

## 10.7 CORS

CORS configuré sur `FRONTEND_URL` (par défaut `*` en dev). En production, la valeur est restreinte à l'origine officielle du front.

## 10.8 Webhooks Stripe

Les webhooks Stripe sont authentifiés via la signature `Stripe-Signature` (vérifiée avec `stripe.webhooks.constructEvent`). La clé `STRIPE_WEBHOOK_SECRET` est stockée en variable d'environnement. Les events traités sont notamment `payment_intent.succeeded`, `payment_intent.payment_failed`, `invoice.paid`, `customer.subscription.updated`.

## 10.9 Variables d'environnement

Les secrets ne sont jamais commités. Les fichiers `.env` sont listés dans `.gitignore` avec d'autres fichiers sensibles. Un fichier `.env.example` ou `.env.sample` documente les clés attendues sans valeurs.

| Clé | Usage |
|---|---|
| `DATABASE_URL` | URL PostgreSQL. |
| `JWT_SECRET` | Clé de signature des JWT. |
| `STRIPE_SECRET_KEY` | Clé serveur Stripe. |
| `STRIPE_WEBHOOK_SECRET` | Vérification webhooks. |
| `FRONTEND_URL` | Origin CORS. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | Envoi e-mails. |
| `GEMINI_API_KEY` | Module chatbot (Google GenAI). |
| `PORT` | Port d'écoute. |

## 10.10 RGPD

- les données collectées sont strictement nécessaires (e-mail, nom, adresses de livraison / facturation, moyens de paiement chez Stripe) ;
- les utilisateurs peuvent demander la suppression de leur compte (route `DELETE /users/me` à finaliser dans la version production) ;
- les e-mails transactionnels n'incluent pas de données sensibles ;
- les logs ne contiennent pas de mots de passe ni de tokens en clair ;
- la conservation des données est documentée (durée de vie d'une commande, d'un abonnement clôturé, d'un message de contact) ;
- la base est hébergée en France ou en UE (selon le déploiement final).

## 10.11 Considérations spécifiques au domaine cybersécurité

CYNA étant elle-même une entreprise de cybersécurité, sa plateforme commerciale doit incarner les standards qu'elle vend. Au-delà des bonnes pratiques génériques, plusieurs points spécifiques sont à honorer :

### 10.11.1 Crédibilité affichée

La plateforme exhibe par son comportement les principes qu'elle promeut :

- **HTTPS strict** — pas de mixed content, HSTS activé en production avec une durée raisonnable (1 an) et `includeSubDomains` ;
- **CSP (Content Security Policy)** — politique restrictive sur les scripts (interdire `unsafe-inline` autant que possible), sur les frames, sur les workers ; politique testée en mode `Report-Only` avant activation ;
- **headers de sécurité** — `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restrictif, `X-Content-Type-Options: nosniff` ;
- **cookies** — `Secure`, `HttpOnly`, `SameSite=Strict` (ou `Lax` si nécessaire pour des redirections OAuth) ;
- **certificats** — Let's Encrypt managé par la plateforme de déploiement, renouvellement automatique.

### 10.11.2 Cohérence des messages

La plateforme ne doit pas relâcher la garde sur des détails qui paraîtraient triviaux mais qui dégraderaient la crédibilité :

- pas de message d'erreur trop verbeux qui exposerait des chemins serveur, versions de dépendances, traces de stack ;
- pas de divulgation par effet de bord (ex. login indiquant si un e-mail existe vs si le mot de passe est faux — uniformiser à « identifiants invalides ») ;
- pas de tokens de session écrits dans des logs d'audit ou des analytics tiers.

### 10.11.3 Observabilité de la sécurité

À terme, la plateforme doit produire des signaux exploitables par un SOC :

- logs structurés (JSON) avec corrélation par `requestId` ;
- événements de sécurité catégorisés (`auth.login.success`, `auth.login.failure`, `auth.password.reset`, `admin.action.executed`, `payment.webhook.processed`) ;
- alerting sur les patterns suspects (5 échecs login en 1 min sur le même e-mail, accès admin depuis une IP non vue, paiement avec un montant atypique).

Le module `admin-analytics` peut servir de point d'entrée à cette observabilité côté admin.

## 10.12 Risques de sécurité identifiés

| Risque | Mitigation actuelle | Action future |
|---|---|---|
| Brute force sur login | Délais artificiels minimaux | Rate limiter dédié, captcha sur 5 tentatives. |
| Token JWT compromis | Durée 24h, rotation au login | Refresh token + révocation côté API. |
| XSS via contenu admin (carousel, home blocks) | Échappement React | Sanitizer côté API à l'écriture (DOMPurify-like). |
| CSRF | JWT en httpOnly + SameSite | Vérification d'origine sur mutations sensibles. |
| Fuite de secrets | `.gitignore` + revues PR | Secret scanning automatique sur PR. |
| Dépendances vulnérables | `pnpm audit` ponctuel | Snyk / Dependabot en CI. |

---

# 11. Paiement

## 11.1 Choix de Stripe

Stripe est l'acquéreur principal retenu, pour les raisons suivantes :

- maturité de la documentation et de l'outillage (Stripe CLI, dashboard, webhooks) ;
- couverture européenne, conformité PSD2 et 3DS gérée nativement ;
- intégration React via Stripe Elements (collecte des données carte hors de notre serveur — réduction de la surface PCI) ;
- support multi-méthodes (carte, Link, Apple Pay, Google Pay) sur la même primitive `PaymentIntent`.

## 11.2 PayPal

PayPal n'est pas un moyen de paiement natif Stripe au même titre que la carte. L'ajout de PayPal est documenté comme une extension distincte (SDK PayPal Buttons côté front + endpoint dédié `POST /payement/paypal` + webhook PayPal côté API). Cette extension n'est pas réalisée dans le livrable final ; elle figure dans la roadmap.

## 11.3 Flux de paiement carte

```
Front (Stripe Elements)         API (NestJS)              Stripe
       │                           │                         │
       │  ── POST /v1/payement ──▶ │                         │
       │   { amount, currency }    │                         │
       │                           │ ── createPaymentIntent ▶│
       │                           │ ◀── client_secret ──────│
       │ ◀── 200 { clientSecret }──│                         │
       │                           │                         │
       │  confirmCardPayment(...)──┼────────────────────────▶│
       │                           │                         │
       │ ◀────── result ───────────┼─────────────────────────│
       │                           │                         │
       │                           │ ◀── webhook event ──────│
       │                           │  payment_intent.succeeded│
       │                           │                         │
       │                           │ marque Order PAID       │
       │                           │ génère Invoice          │
       │                           │ envoie email confirm.   │
```

**Schéma 11.1 — Flux de paiement carte avec Stripe.** Le front initie une intention de paiement côté API, qui crée un `PaymentIntent` chez Stripe et renvoie le `clientSecret`. Stripe Elements confirme le paiement directement avec Stripe ; le webhook serveur côté Stripe confirme le passage à l'état `succeeded`, ce qui déclenche la mise à jour de la commande, la génération de la facture et l'envoi de l'e-mail de confirmation.

## 11.4 Webhooks

Endpoint dédié (raw body activé via `NestFactory.create(AppModule, { rawBody: true })`). Vérification de signature via `stripe.webhooks.constructEvent(body, signature, secret)`. Idempotence assurée par stockage de l'`event.id` traité côté API (pour éviter les double-traitements en cas de re-tentative Stripe).

Events principaux traités :

- `payment_intent.succeeded` — passe `Order` à `PAID`, déclenche la création de l'`Invoice`, la création / l'activation de la `Subscription` si la commande inclut un abonnement, l'envoi de l'e-mail de confirmation ;
- `payment_intent.payment_failed` — passe `Order` à `CANCELLED` ou marque l'échec, notifie l'utilisateur ;
- `invoice.paid` (abonnements récurrents) — confirme le renouvellement, met à jour `Subscription.nextRenewalAt` ;
- `customer.subscription.updated` — synchronise `SubscriptionStatus` côté API ;
- `customer.subscription.deleted` — passe `Subscription.status` à `CANCELLED`.

## 11.5 Tests Stripe

L'environnement de test Stripe est utilisé pour la démonstration, avec :

- la clé `sk_test_...` côté serveur et `pk_test_...` côté client ;
- des numéros de carte de test documentés (4242 4242 4242 4242 pour réussite, 4000 0000 0000 0002 pour échec, etc.) ;
- la Stripe CLI pour relayer les webhooks vers le poste de développement (`stripe listen --forward-to localhost:3000/api/v1/payement/webhook`).

---

# 12. Mobile — `Cyna_mobile`

## 12.1 Stack technique

| Couche | Technologie | Version |
|---|---|---|
| Framework | Expo | 54.x |
| Plateforme | React Native | 0.81 |
| Langage | TypeScript | 5.x |
| Routing | expo-router | 6.x |
| Navigation | @react-navigation/native + bottom-tabs | 7.x |
| Animation | react-native-reanimated | 4.x |
| Gestures | react-native-gesture-handler | 2.x |
| Image | expo-image | 3.x |
| Web | react-native-web | 0.21.x |
| Web embed | react-native-webview | 13.x |

## 12.2 Périmètre

L'application mobile est démonstrative. Elle illustre la possibilité d'un canal mobile cohérent avec la plateforme web. Le périmètre fonctionnel actuel est limité :

- navigation par onglets (`(tabs)` directory dans `expo-router`) ;
- écrans mockés avec composants réutilisables (`themed-text`, `themed-view`, `parallax-scroll-view`) ;
- intégration API non productisée — démonstrative.

## 12.3 Choix structurants

- **Expo plutôt que React Native CLI** — productivité, build cross-plateforme géré, EAS Build / Submit disponibles pour la distribution ; trade-off : limites sur les modules natifs custom (acceptable pour le périmètre).
- **expo-router** — routage par fichiers, calqué sur Next.js App Router. Cohérent avec l'architecture web, abaisse la charge mentale en passant d'une plateforme à l'autre.
- **react-native-webview** — pour les écrans qui n'ont pas de version native dédiée (par exemple les pages légales), un WebView pointe vers la page vitrine équivalente.

## 12.4 Limites identifiées

- pas de push notifications ;
- pas de deep links cross-plateforme finalisés ;
- pas de gestion offline ;
- intégration API à compléter (auth, panier, checkout cohérent avec le web) ;
- distribution non publiée (pas de TestFlight, pas de Play Store interne).

L'application est un **démonstrateur** et non un livrable productisé.

---

# 13. Déploiement

## 13.1 Déploiement frontend

La vitrine est compatible avec plusieurs plateformes de déploiement Next.js :

- **Vercel** (déploiement de référence Next.js) ;
- **Netlify** (le plugin `@netlify/plugin-nextjs` est dans les devDependencies) ;
- **conteneur Docker** auto-hébergé (build `next build` puis `next start`).

En contexte projet, la vitrine peut être lancée localement par `pnpm dev` (port 3000 par défaut).

## 13.2 Déploiement backend

L'API est packagée via `nest build` (sortie dans `dist/`). Elle se lance par `node dist/main` (script `start:prod`). En contexte projet :

- exécution locale par `pnpm start:dev` (watch + hot reload) ;
- exécution test par `pnpm start:prod` après build.

En production, plusieurs options sont possibles :

- **Render / Railway / Fly.io** — déploiement géré direct depuis le dépôt ;
- **VPS auto-hébergé** — Docker + reverse proxy (Caddy, Traefik ou Nginx) ;
- **Kubernetes** — pour des volumes plus importants, hors périmètre projet.

## 13.3 Base de données

PostgreSQL géré (Neon, Supabase, Railway, RDS) en production. Migrations appliquées par `prisma migrate deploy` en pipeline de release.

## 13.4 Variables d'environnement de production

Les variables documentées au § 10.9 sont à fournir au runtime. Aucune variable sensible n'est hardcodée. Les plateformes de déploiement (Vercel, Netlify, Render) fournissent un coffre-fort de variables d'environnement au niveau du projet.

## 13.5 Domaine et DNS

Pour une mise en production, le DNS pointerait :

- `cyna.example` → vitrine ;
- `api.cyna.example` → API ;
- `admin.cyna.example` → back-office (peut être co-hébergé sur la vitrine sous `/admin`).

HTTPS imposé via certificats Let's Encrypt managés par la plateforme.

## 13.6 CI/CD

Le projet n'a pas de pipeline CI/CD actif. La roadmap (§ 17) le recommande à court terme, avec :

- lint + build + tests sur chaque PR ;
- déploiement automatique sur staging à chaque merge vers `main` ;
- déploiement production sur tag de release.

---

# 14. Backup de démonstration

## 14.1 Contexte

À l'approche de la soutenance, la chaîne complète (vitrine + API + base + paiement) a connu une instabilité résultant d'une accumulation : intégrations tardives, variables d'environnement non synchronisées entre les machines, dépendances mal alignées sur certains postes, parcours testés isolément mais pas en chaîne. Une démonstration en direct sur la version principale présentait un risque significatif d'erreur visible.

## 14.2 Décision

L'équipe a décidé collectivement, à J-3 de l'oral, de préparer une version de secours, hébergée sur une machine maîtrisée par un membre de l'équipe, avec une configuration validée et un parcours de démonstration stabilisé. Cette décision est documentée comme une mesure de gestion de risque, pas comme un substitut au projet principal.

## 14.3 Composition du backup

Le dossier `backup/` contient :

- `cyna-vitrine/` — copie de la vitrine, configurée pour pointer vers l'API du backup ;
- `cyna-api/` — copie de l'API, configurée avec une base PostgreSQL locale ou managée dédiée et des clés Stripe en mode test.

## 14.4 Validation

Le parcours minimal validé sur le backup couvre :

- chargement de l'accueil et du catalogue ;
- ouverture d'une fiche produit ;
- ajout au panier ;
- création de compte avec e-mail de test ;
- connexion ;
- checkout avec carte de test (4242 4242 4242 4242) ;
- accès aux pages compte (commandes, profil) ;
- ouverture des pages légales (CGU, mentions légales) ;
- responsive mobile sur les pages publiques.

## 14.5 Transparence

L'utilisation du backup en démonstration est annoncée explicitement au jury. Le récit présenté n'efface pas le projet principal : le backup est un filet de sécurité, le projet principal reste le référent technique. Les écarts entre les deux versions (s'il y en a) sont annoncés.

---

# 15. Tests et validation

## 15.1 Stratégie de test

Les tests couvrent trois niveaux :

- **statique** — typage TypeScript strict, lint ESLint sur tous les dépôts ;
- **unitaire** — tests Jest côté API sur les services métier (`*.spec.ts`) ;
- **manuel guidé** — checklist de validation avant la soutenance, exécutée sur le backup.

Les tests end-to-end automatisés (Playwright / Cypress) sont identifiés comme axe d'amélioration prioritaire (§ 17). Ils ne sont pas en place au moment du livrable.

## 15.2 Tests statiques

| Dépôt | Outils | Statut |
|---|---|---|
| `cyna-vitrine` | TypeScript, ESLint (`eslint-config-next`) | OK |
| `cyna-api` | TypeScript, ESLint (`@typescript-eslint`) + Prettier | OK |
| `Cyna_mobile` | TypeScript, ESLint (`eslint-config-expo`) | OK |

Commande type : `pnpm lint && pnpm tsc --noEmit`.

## 15.3 Tests unitaires API

Les services NestJS principaux ont des fichiers `.spec.ts`. La configuration Jest est dans `package.json` côté `cyna-api`. Cible :

- `auth.service.spec.ts` — création de compte, login, vérification mot de passe ;
- `products.service.spec.ts` — récupération catalogue, filtres, recherche ;
- contrôleurs — tests d'intégration légers via `Test.createTestingModule(...)`.

Couverture actuelle : partielle. La couverture complète est un axe d'amélioration.

## 15.4 Tests manuels guidés

Une checklist de validation est exécutée sur le backup avant la soutenance. Elle couvre les points suivants :

| Catégorie | Test | Résultat attendu |
|---|---|---|
| Lancement | `pnpm dev` côté vitrine | Page d'accueil chargée sans erreur console. |
| Lancement | `pnpm start:dev` côté API | Application démarrée, Swagger accessible sur `/docs`. |
| API | `GET /api/v1/products` | 200, liste de 6 produits. |
| API | `POST /api/v1/auth/signup` | 201, e-mail de vérification déclenché. |
| API | `POST /api/v1/auth/login` | 200, token JWT retourné. |
| API | `GET /api/v1/cart` (auth) | 200, panier de l'utilisateur. |
| API | `POST /api/v1/payement` | 201, `clientSecret` Stripe. |
| API | webhook Stripe `payment_intent.succeeded` | Order passe à `PAID`, Invoice créée. |
| Vitrine | Parcours achat carte 4242 | Confirmation, redirection compte. |
| Vitrine | Recherche produit | Résultats filtrés correctement. |
| Vitrine | Panier visiteur puis connexion | Fusion panier visiteur ↔ panier compte. |
| Vitrine | Reset password | E-mail reçu, code OTP fonctionnel. |
| Vitrine | Page CGU / mentions légales | Affichées correctement. |
| Vitrine | Responsive mobile (viewport 360×640) | Layout cohérent, navigation accessible. |
| Admin | Connexion admin avec 2FA | Code TOTP demandé, accès tableau de bord. |
| Build | `pnpm build` côté vitrine | Build sans warning bloquant. |
| Build | `pnpm build` côté API | Build sans erreur, dist généré. |

## 15.5 Tests Stripe

Les flux Stripe sont validés via la CLI :

```bash
stripe listen --forward-to localhost:3000/api/v1/payement/webhook
```

Cartes utilisées :

- `4242 4242 4242 4242` — paiement réussi ;
- `4000 0000 0000 0002` — paiement refusé ;
- `4000 0027 6000 3184` — 3D Secure requis ;
- `4000 0000 0000 9995` — fonds insuffisants.

Pour chaque carte, la chaîne complète (front → API → Stripe → webhook → API → DB) est vérifiée.

## 15.6 Bugs connus à la livraison

| ID | Composant | Description | Sévérité | Statut |
|---|---|---|---|---|
| B-001 | vitrine | i18n incomplet sur `/account/orders` | mineure | identifié, roadmap. |
| B-002 | vitrine | recherche : pas de débounce sur l'input | mineure | identifié, simple à corriger. |
| B-003 | API | rate limiter manquant sur `/auth/login` | moyenne | identifié, prioritaire. |
| B-004 | API | erreur 500 silencieuse si webhook Stripe reçoit un event non géré | mineure | logger + 200 par défaut. |
| B-005 | mobile | déconnexion API après mise en veille longue | mineure | démonstratif, hors périmètre productisé. |
| B-006 | infra | pas de CI/CD active | importante | roadmap immédiate. |

## 15.7 Couverture des exigences

Le tableau de couverture est fourni en annexe A. Il croise chaque exigence du cahier des charges avec une preuve dans le dépôt (composant, route, schéma, capture).

---

# 16. Risques et limites

## 16.1 Risques identifiés à la livraison

| ID | Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|---|
| R-01 | Webhook Stripe rejoué (re-tentative) | Moyenne | Moyen | Idempotence par `event.id`. |
| R-02 | Brute force login | Élevée | Élevé | Rate limiter (B-003). |
| R-03 | Compromission `JWT_SECRET` | Faible | Critique | Rotation immédiate, invalidation sessions. |
| R-04 | Fuite de secret en dépôt | Faible | Critique | `.gitignore`, secret scanning à mettre en place. |
| R-05 | Drift schéma front / API | Moyenne | Moyen | Génération de types depuis OpenAPI (roadmap). |
| R-06 | Indisponibilité PostgreSQL | Faible | Critique | Hébergement managé avec haute dispo en production. |
| R-07 | Limite quota Google GenAI (chatbot) | Moyenne | Faible | Fallback FAQ, dégradation gracieuse. |
| R-08 | Saturation par envois e-mail | Faible | Moyen | Service SMTP transactionnel (SendGrid / Postmark) avec quotas. |
| R-09 | Vulnérabilité dépendance | Moyenne | Moyen | `pnpm audit`, Dependabot. |
| R-10 | Changement breaking Stripe API | Faible | Moyen | Versionner la version d'API Stripe, watch des changelogs. |

## 16.1.1 Analyse approfondie des risques majeurs

### Risque R-01 — Webhook Stripe rejoué

**Description.** Stripe peut envoyer plusieurs fois le même webhook si la première réponse côté API n'a pas été un `2xx` rapide ou si la connexion s'est interrompue. Sans précaution, le traitement double pourrait créer deux factures, deux activations d'abonnement, deux e-mails de confirmation.

**Mitigation actuelle.** À la réception d'un événement, l'API vérifie si l'`event.id` Stripe est déjà présent dans une table dédiée `WebhookEventProcessed`. Si oui, l'événement est ignoré et l'API répond immédiatement `200`. Si non, le traitement est exécuté dans une transaction qui inclut l'enregistrement de l'`event.id`. Ce schéma garantit l'idempotence sans verrouillage explicite.

**Tests associés.** Test manuel via Stripe CLI : déclenchement double du même événement, vérification que la deuxième occurrence est marquée comme déjà traitée dans les logs et qu'aucun effet de bord ne se produit côté DB.

### Risque R-02 — Brute force login

**Description.** Sans rate limiter, un attaquant peut tenter des milliers de combinaisons e-mail/mot de passe par seconde. Avec un dictionnaire commun, des comptes faibles peuvent être compromis en quelques heures.

**Mitigation cible.** Rate limiter au niveau de la route `/auth/login` : 5 tentatives / minute / e-mail, 20 tentatives / minute / IP. Au-delà : 401 + délai de réponse augmenté (jusqu'à 2 s) pour ralentir l'attaquant. Sur 10 échecs consécutifs : verrouillage temporaire du compte avec e-mail de notification au propriétaire.

**Mitigation actuelle.** Aucune. C'est l'un des bugs prioritaires (B-003).

**Action.** À implémenter en priorité 1 dans la roadmap immédiate. Bibliothèque candidate : `@nestjs/throttler` avec un store Redis pour la persistance entre instances.

### Risque R-03 — Compromission JWT_SECRET

**Description.** Si le secret de signature JWT fuit (commit accidentel, log, dump de configuration), un attaquant peut forger des tokens valides pour n'importe quel utilisateur, y compris des admins.

**Mitigation actuelle.** Le secret est uniquement en variable d'environnement, jamais commité. Le `.gitignore` exclut les `.env`.

**Mitigation cible.** En cas de soupçon de fuite :

1. rotation immédiate du secret côté plateforme de déploiement ;
2. tous les JWT en circulation deviennent invalides (signature cassée) ;
3. les utilisateurs sont redirigés vers la page de connexion à leur prochaine requête ;
4. analyse forensic : qui a accédé aux logs de cette période, quels comptes ont émis quoi.

À terme : versioning du secret avec rotation programmée trimestrielle, sans rupture de service (acceptation des deux versions pendant la fenêtre de rotation).

### Risque R-04 — Fuite de secret en dépôt

**Description.** Un développeur peut committer accidentellement un fichier `.env` ou une clé API dans le code.

**Mitigation actuelle.** `.gitignore` correctement configuré. Revue PR. Pas de scan automatique.

**Mitigation cible.** Activation d'un secret scanner (GitHub Secret Scanning natif, Gitleaks pre-commit). Hook pre-commit `husky` qui refuse le commit si une chaîne ressemblant à une clé API est détectée. Procédure documentée en cas de fuite : révocation immédiate de la clé chez le fournisseur, rotation, audit.

### Risque R-05 — Drift schéma front / API

**Description.** Le schéma OpenAPI exposé par Swagger est généré automatiquement à partir des décorateurs NestJS. La vitrine, elle, maintient ses types TypeScript à la main. Un changement côté API non répercuté côté front casse silencieusement à l'exécution.

**Mitigation cible.** Génération des types TypeScript de la vitrine depuis `/docs/json` via un outil comme `openapi-typescript` ou `orval`. Lancement automatique en CI lors d'un changement côté API. Le résultat : un changement breaking côté API échoue la build du front avant même d'arriver en runtime.

### Risque R-06 — Indisponibilité PostgreSQL

**Description.** Sans la base, l'API entière est inopérante. Sur une base self-hosted single-node, une panne disque ou réseau peut prendre des heures à résoudre.

**Mitigation cible production.** Hébergement managé (Neon, Supabase, RDS) avec :

- backup automatique quotidien ;
- point-in-time recovery (PITR) sur les 7 derniers jours ;
- haute disponibilité (réplica synchrone ou asynchrone selon le SLA cible) ;
- monitoring de santé (latence, taille de connexion pool, erreurs) ;
- plan de bascule documenté.

### Risque R-07 — Quota Google GenAI

**Description.** L'API Google GenAI est sujette à des limites de quota et à un coût par token. Un pic d'utilisation (ou un abus) peut épuiser le quota ou produire une facture inattendue.

**Mitigation cible.**

- limite par utilisateur (ex. 50 messages/jour) ;
- alerting de dépassement à 80 % du quota global ;
- circuit breaker — si la latence de l'API dépasse 5 s ou si le taux d'erreur dépasse 10 % sur 1 min, fallback systématique sur la FAQ ;
- masquage proactif des données utilisateur avant envoi à l'API tierce (no PII transmis sans nécessité).

### Risque R-08 — Saturation SMTP

**Description.** Si tous les e-mails transactionnels passent par un SMTP non scalable (ex. Gmail, OVH), un pic de signups ou de resets peut saturer le quota.

**Mitigation cible.** Service transactionnel dédié (SendGrid, Postmark, Resend) avec quota élevé, file d'attente côté API si le service est temporairement indisponible, retry exponentiel.

### Risque R-09 — Vulnérabilité dépendance

**Description.** Une dépendance NPM peut introduire une vulnérabilité (CVE) qui rend l'application attaquable à distance.

**Mitigation cible.** Dependabot ou Renovate activé sur les deux dépôts, avec :

- mises à jour automatiques sur les patch versions ;
- PR automatique pour les minor versions, à valider manuellement ;
- alertes prioritaires sur les CVE critiques.

`pnpm audit` exécuté manuellement à intervalles réguliers tant que l'outillage CI n'est pas en place.

### Risque R-10 — Changement breaking Stripe API

**Description.** Stripe versionne son API par date. Un changement breaking sur une nouvelle version peut casser une intégration si on bascule sans précaution.

**Mitigation actuelle.** La version d'API utilisée est explicitement déclarée à l'instanciation du SDK. Stripe ne casse jamais une version déjà publiée.

**Mitigation cible.** Surveillance du changelog Stripe ; basculement de version programmé une fois par an, avec une fenêtre de validation sur staging avant production.

## 16.2 Limites connues

- **CI/CD absente** — les builds et tests se lancent à la main avant chaque push ; risque d'oubli ;
- **e2e absents** — pas de Playwright / Cypress ; la non-régression est manuelle ;
- **monitoring absent** — pas d'APM (Sentry, Datadog, NewRelic) ; un crash en production passerait inaperçu ;
- **logs non centralisés** — logs `console.log` côté API ; en production, un agrégateur (Loki, ELK) serait nécessaire ;
- **i18n partielle** — certaines pages internes restent monolingues ;
- **mobile non productisé** — démonstrateur, pas de soumission stores ;
- **PayPal absent** — extension documentée, non livrée ;
- **back-office UI minimal** — l'administration courante repose sur Swagger ;
- **chatbot conversationnel partiel** — FAQ + matching côté front, intégration GenAI partielle côté API.

---

# 17. Maintenance et évolutions

## 17.1 Maintenance corrective

Les bugs critiques (B-003, B-006) sont à traiter en priorité. Le cycle de correction proposé :

1. report d'un bug par un canal défini (ticket GitHub, support) ;
2. reproduction documentée ;
3. correction sur branche dédiée ;
4. PR avec tests ;
5. déploiement en staging ;
6. validation puis déploiement en production.

## 17.1.1 Observabilité — plan détaillé

L'observabilité est aujourd'hui le point faible le plus net de la plateforme. Sans monitoring, un incident en production peut passer inaperçu jusqu'au signalement par un utilisateur, ce qui est inacceptable pour une plateforme commerciale et incompatible avec l'image d'une entreprise de cybersécurité.

Plan en quatre couches :

### Couche 1 — APM applicatif (Sentry)

**Périmètre.** Vitrine + API + mobile.

**Captures.**

- erreurs JavaScript non capturées ;
- erreurs HTTP côté API avec contexte (route, userId, requestId, payload anonymisé) ;
- crashs natifs côté mobile.

**Alerting.**

- pic d'erreurs (taux > 1 % des requêtes sur 5 min) ;
- nouvelle erreur jamais vue ;
- erreur dans un parcours critique (signup, login, payment).

**Coût estimé.** Plan gratuit Sentry tient pour les premiers mois ; plan team à partir de quelques milliers d'événements quotidiens.

### Couche 2 — Logs centralisés

**Format.** JSON structuré, schéma défini.

**Champs minimum.** `timestamp`, `level`, `message`, `service`, `requestId`, `userId` (si applicable), `event` (canonique pour les événements importants), `metadata` (objet libre, anonymisé).

**Agrégation.** Loki ou ELK. Rétention 30 jours minimum. Recherche par `requestId` pour reconstruire un parcours utilisateur.

**Anonymisation.** Aucune donnée personnelle ne va dans les logs. Les e-mails, mots de passe, tokens, numéros de carte sont systématiquement remplacés par un placeholder ou un hash non reverse.

### Couche 3 — Métriques applicatives

**Sources.** Counter / gauge / histogram exposés par l'API via un endpoint `/metrics` au format Prometheus.

**Métriques clés.**

- `http_requests_total{method,route,status}` ;
- `http_request_duration_seconds_bucket{method,route}` ;
- `auth_login_total{result}` ;
- `payment_webhook_processed_total{event_type,status}` ;
- `database_query_duration_seconds_bucket{operation}` ;
- `external_api_call_duration_seconds_bucket{provider}` ;
- `business_orders_total{status}` ;
- `business_subscriptions_active_gauge`.

**Visualisation.** Grafana avec dashboards par domaine (HTTP, Auth, Payment, Business, Infra).

**Alerting.** Latence p95 > 1 s sur les routes critiques, taux d'erreur > 1 %, taux de connexions DB saturé.

### Couche 4 — Suivi métier

**Source.** Le module `admin-analytics` côté API + une intégration analytics côté front (Plausible, Matomo, Umami — pas Google Analytics pour des raisons RGPD et identité cyber).

**Indicateurs.**

- conversion catalogue → fiche produit ;
- conversion fiche produit → ajout panier ;
- conversion ajout panier → checkout ;
- conversion checkout → commande payée ;
- taux d'abandon par étape ;
- temps moyen entre première visite et première commande ;
- répartition par catégorie SOC / EDR / XDR ;
- taux de résiliation des abonnements.

Ces indicateurs nourrissent les décisions produit et permettent à CYNA de mesurer l'efficacité du nouveau canal.

## 17.1.2 Plan de tests — détail

L'approche test cible repose sur trois niveaux et une discipline de couverture.

### Niveau unitaire (cible 70 % de couverture services)

- chaque service exporté testé sur ses cas nominaux + 2 à 3 cas d'erreur ;
- mocking de Prisma via `jest-mock-extended` ou un mock manuel pour les tests des services qui ne nécessitent pas la base réelle ;
- test des helpers (validation de mot de passe, formatage des prix, génération de slug) ;
- test des pipes / gardes / décorateurs custom ;
- exécution sur chaque PR via la CI ;
- failure block merge.

### Niveau intégration (cible 20 %)

- tests `Test.createTestingModule(...)` montant un module avec des dépendances mockées ;
- test des contrôleurs avec un superagent (`@nestjs/testing` + `supertest`) sur une instance Nest mémoire ;
- vérification des routes, codes HTTP, formes de réponse, gardes ;
- pas de DB réelle à ce niveau — Prisma mocké.

### Niveau end-to-end (cible 10 %)

- Playwright côté vitrine, scénarios couvrant les 7 cas d'usage du § 4.3.1 ;
- API côté backup avec une base PostgreSQL dédiée éphémère (Docker Compose) ;
- exécution sur staging à chaque déploiement ;
- environnement de test avec données déterministes (seed fixé) ;
- captures et vidéos archivées 30 jours ;
- tests qui touchent Stripe utilisent les cartes de test et la CLI en mode webhook listener.

### Tests non fonctionnels

- charge — k6 ou Artillery avec scénarios sur les routes les plus fréquentées (catalogue, fiche produit, login) ;
- sécurité — OWASP ZAP en passive scan sur staging, audit annuel par un tiers ;
- accessibilité — axe-core en CI (échec si une violation de niveau A ou AA apparaît) ;
- performance — Lighthouse CI sur la home, le catalogue, une fiche produit, le checkout.

## 17.2 Maintenance évolutive

L'évolution s'organise autour de la roadmap ci-dessous, en trois horizons.

### Court terme (immédiat à 1 mois)

- mettre en place une CI minimale (lint, build, tests) sur chaque PR ;
- corriger B-003 (rate limiter login) et B-006 (CI/CD) ;
- ajouter Sentry sur la vitrine et l'API ;
- finaliser la suppression de compte utilisateur (RGPD) ;
- générer les types front depuis le schéma OpenAPI exposé par Swagger ;
- compléter l'i18n sur les pages compte ;
- documenter et publier un environnement de staging.

### Moyen terme (1 à 3 mois)

- back-office UI complète (catalogue, commandes, contenus dynamiques) en remplacement de Swagger ;
- intégration PayPal (SDK + webhook + tests) ;
- tests e2e sur les parcours critiques (signup, login, achat, reset) ;
- monitoring applicatif (APM) et logs centralisés ;
- recherche serveur catalogue sur `pg_trgm` activée et indexée ;
- audit de sécurité externe (OWASP top 10) ;
- audit accessibilité WCAG AA.

### Long terme (3 à 12 mois)

- mobile productisé (push, deep links, distribution stores) ;
- internationalisation complète (FR / EN ; ouverture multi-langue future) ;
- module de facturation conforme (PDF, conformité comptable) ;
- chatbot conversationnel productisé (modèle aligné, garde-fous, feedback humain) ;
- multi-tenant si ouverture à plusieurs clients CYNA ;
- politique de retention et anonymisation automatique au-delà d'une durée de conservation paramétrable.

## 17.3 Gouvernance d'évolution

Un comité de pilotage trimestriel (équipe + sponsor CYNA en contexte réel) priorise la roadmap, arbitre les ressources, valide les jalons. La dette technique est suivie dans un backlog dédié, distinct des évolutions fonctionnelles, et un quota par sprint est réservé à la dette (proposition : 20 % du temps).

---

# 18. Conclusion

La plateforme e-commerce CYNA livrée à l'issue du projet pédagogique CPI DEV répond à la majeure partie des exigences du cadrage initial. Les écarts (PayPal, back-office UI complet, mobile productisé, chatbot conversationnel complet) sont identifiés, justifiés et figurent dans la roadmap. La stack retenue (Next.js, NestJS, Prisma, PostgreSQL, Stripe, Expo) s'écarte de la stack théorique du document de cadrage, mais elle est défendable, cohérente et alignée sur les compétences de l'équipe.

Le projet a connu en fin de cycle une instabilité de la chaîne complète, qui a été traitée par la préparation d'une version de secours utilisée en démonstration. Cette mesure de gestion de risque est documentée avec transparence ; elle n'efface pas le projet principal mais en sécurise la présentation.

Les principaux acquis du projet, au-delà de la livraison fonctionnelle, sont :

- une architecture multi-dépôts cohérente et défendable ;
- une sécurité de base appliquée (hachage bcrypt, JWT, rôles, 2FA admin, validation d'entrée, webhooks signés) ;
- une intégration paiement réelle (Stripe + webhooks idempotents) ;
- une documentation technique livrable (DAT, REX, Swagger interactif, matrice de conformité, schéma de données).

Les principaux axes d'amélioration prioritaires identifiés sont :

- mise en place d'une CI/CD avant tout autre travail ;
- correction du rate limiter login (sécurité) ;
- monitoring applicatif (Sentry) ;
- génération des types front depuis OpenAPI ;
- tests e2e sur les parcours critiques.

Ces axes constituent un plan d'action exécutable sur les semaines suivant la soutenance, et permettent de stabiliser la solution pour une mise en production réelle dans un délai raisonnable (2 à 3 mois selon la disponibilité de l'équipe).

---

# 19. Annexes

## Annexe A — Matrice de conformité aux exigences

Légende : **OK** = exigence satisfaite ; **Partiel** = satisfaite à un degré ; **HP** = hors périmètre, justifié ; **Écart** = écart documenté par rapport au cadrage.

| § Cadrage | Exigence | Statut | Preuve / Localisation | Notes |
|---|---|---|---|---|
| I.1 | Plateforme e-commerce mobile-first | OK | `cyna-vitrine/src/app/**`, `globals.css` | Responsive Tailwind. |
| II.2.1 | Identité visuelle CYNA (couleurs, logo, esprit cyna-it.fr) | OK | `globals.css`, `CynaLogo.tsx`, `AppHeader.tsx` | Variables CSS, dégradé violet → magenta. |
| II.2.1 | Catalogue 5–7 produits phares | OK | `constant.ts`, base seedée | 6 produits. |
| II.2.1 | 3 catégories : SOC, EDR, XDR | OK | `catalog/page.tsx`, `Category` (Prisma) | Filtres : Tous, SOC, EDR, XDR. |
| II.2.1 | Chatbot FAQ + saisie libre | Partiel | `lib/supportFaq.ts`, `support/page.tsx`, `chatbot` (API) | FAQ + matching ; fallback GenAI partiel. |
| II.2.1 | Paiement Stripe | OK | `checkout/page.tsx`, `cyna-api/src/v1/payement/*` | Carte + webhooks. |
| II.2.1 | Paiement PayPal | HP | — | Documenté dans `CADRAGE-ALIGNEMENT.md` ; non livré. |
| II.2.1 | Back-office | Partiel | `cyna-api` routes admin + Swagger | UI admin minimale, gestion via Swagger. |
| II.2.1 | Base de données relationnelle | OK | `cyna-api/prisma/schema.prisma` | PostgreSQL au lieu de MariaDB (écart documenté). |
| II.2.1 | Outils collaboratifs (Trello, Teams, GitHub) | OK | Trello + Teams + GitHub | — |
| II.2.1 | Documentation et installation | OK | `README.md`, `DAT_CYNA.md`, `REX_*` | — |
| IV.4.1 | Stack Vue / Cordova / Koa / MariaDB | Écart | — | Réalisation Next.js / NestJS / Prisma / PostgreSQL ; justifié § 3.4 et § 6.3.3. |
| Auth | Inscription + vérification e-mail | OK | `auth.controller.ts`, `nodemailer` | E-mail de vérification token. |
| Auth | Connexion + JWT | OK | `auth.controller.ts`, `passport-jwt` | JWT 24h. |
| Auth | Reset mot de passe | OK | `auth.controller.ts`, `User.resetPassword*` | Code OTP avec expiration. |
| Auth | 2FA TOTP admin | OK | `otplib`, `User.twoFactorSecret` | Activation depuis profil admin. |
| Compte | Adresses | OK | `addresses` module, `Address` | — |
| Compte | Moyens de paiement | Partiel | `payment-methods` module | Référencés sur Stripe ; UI minimale. |
| Compte | Commandes | OK | `orders` module, `Order` | — |
| Compte | Factures | OK | `invoices` module, `Invoice` | Références ; pas de PDF conforme. |
| Compte | Abonnements | OK | `subscriptions` module, `Subscription` | Statuts gérés. |
| Catalogue | Recherche | OK (vitrine) | `AppSearch.tsx`, `GET /products/search` (API) | Local + API disponible. |
| Catalogue | Pagination | Prêt | API `?page` `?limit` | Non activée (catalogue petit). |
| Mobile | App fonctionnelle | Démo | `Cyna_mobile/app/*` | Démonstrateur. |
| i18n | FR / EN | Partiel | `i18n/`, `I18nProvider` | Shell traduit ; pages internes partiellement. |
| Légal | CGU + mentions légales | OK | `cgu/page.tsx`, `mentions-legales/page.tsx` | — |
| Sécurité | Hachage mots de passe | OK | bcrypt | — |
| Sécurité | Validation entrée | OK | class-validator + ValidationPipe | — |
| Sécurité | CORS | OK | `enableCors`, `FRONTEND_URL` | — |
| Sécurité | Webhooks signés | OK | `stripe.webhooks.constructEvent` | — |
| Sécurité | Rate limiter | Manquant | — | Roadmap immédiate. |
| Sécurité | Secret scanning | Manquant | — | Roadmap. |
| Doc API | Swagger | OK | `/docs` | — |
| Tests | Unitaires API | Partiel | `*.spec.ts` | Couverture partielle. |
| Tests | E2E | Manquant | — | Roadmap. |
| CI/CD | Pipeline | Manquant | — | Roadmap immédiate. |
| Monitoring | APM | Manquant | — | Roadmap. |

## Annexe B — Schéma de base de données (extrait du modèle Prisma)

Le modèle complet figure dans `cyna-api/prisma/schema.prisma`. Extrait synthétique :

```
User ────┬──── Session
         ├──── PasswordResetToken
         ├──── Address
         ├──── PaymentMethod
         ├──── Cart ─── CartItem ─── Product
         ├──── Order ─── OrderItem ─── Product
         │         └─── Invoice
         ├──── Subscription ─── SubscriptionPlan ─── Product
         ├──── ContactMessage
         └──── ChatbotSession ─── ChatbotMessage

Category ─── Product

Carousel
HomeTextBlock
```

**Schéma B.1 — Extrait simplifié des relations principales.** L'utilisateur est l'entité racine de la majorité des relations métier. Le catalogue (`Category` ↔ `Product` ↔ `SubscriptionPlan`) est branché sur l'expérience d'achat (`Cart`, `Order`, `Subscription`) qui produit des artefacts (`Invoice`).

## Annexe C — Diagrammes de séquence

### C.1 Inscription et vérification e-mail

```
Client                  API                    DB                    SMTP
  │                      │                      │                     │
  │── POST /auth/signup ▶│                      │                     │
  │   (email, password)  │                      │                     │
  │                      │── createUser ──────▶│                     │
  │                      │   (passwordHash)     │                     │
  │                      │ ◀── userId ──────────│                     │
  │                      │── createToken ──────▶│                     │
  │                      │   (verifyToken)      │                     │
  │                      │── sendVerify ──────────────────────────────▶│
  │ ◀─ 201 createdUser ──│                      │                     │
  │                      │                      │                     │
  │   (e-mail reçu)      │                      │                     │
  │── GET /auth/verify ─▶│                      │                     │
  │   (token)            │                      │                     │
  │                      │── markVerified ────▶│                     │
  │ ◀── 200 OK ──────────│                      │                     │
```

### C.2 Connexion avec 2FA admin

```
Client                  API                    DB
  │                      │                      │
  │── POST /auth/login ─▶│                      │
  │   (email, password)  │── findUser ────────▶│
  │                      │ ◀── user ────────────│
  │                      │  bcrypt.compare      │
  │                      │  twoFactorEnabled?   │
  │ ◀── 200 challenge2FA │                      │
  │                      │                      │
  │── POST /auth/2fa ───▶│                      │
  │   (totpCode)         │  otplib.verify       │
  │                      │── recordLogin ────▶│
  │ ◀── 200 jwt ─────────│                      │
```

### C.3 Achat avec Stripe (résumé)

Voir schéma 11.1 au § 11.3.

## Annexe D — Captures d'écran et preuves d'exécution

Les captures suivantes sont attendues dans le dossier `docs/captures/` du dépôt en livrable final. Elles sont à fournir par l'équipe avant rendu :

- `home.png` — page d'accueil ;
- `catalog.png` — catalogue avec filtres ;
- `product.png` — fiche produit ;
- `cart.png` — panier avec deux lignes ;
- `checkout.png` — checkout Stripe Elements ;
- `account.png` — espace compte ;
- `swagger.png` — UI Swagger sur `/docs` ;
- `responsive_360.png` — vitrine en viewport mobile 360×640 ;
- `admin_login_2fa.png` — saisie code TOTP ;
- `webhook_terminal.png` — Stripe CLI relayant un webhook ;
- `prisma_studio.png` — vue base de données ;
- `mobile_home.png` — accueil application mobile ;
- `backup_running.png` — version backup en cours d'exécution.

## Annexe E — Liste des routes API (extrait)

Préfixe global `/api/v1`. Liste non-exhaustive ; le détail complet est sur `/docs`.

| Méthode | Route | Auth | Rôle | Description |
|---|---|---|---|---|
| POST | `/auth/signup` | non | — | Création de compte. |
| POST | `/auth/login` | non | — | Connexion. |
| POST | `/auth/2fa` | non (challenge) | — | Validation TOTP. |
| GET | `/auth/verify` | non | — | Vérification e-mail. |
| POST | `/auth/forgot-password` | non | — | Envoi code reset. |
| POST | `/auth/reset-password` | non | — | Reset mot de passe. |
| GET | `/users/me` | oui | USER | Profil courant. |
| PATCH | `/users/me` | oui | USER | Mise à jour profil. |
| GET | `/users` | oui | ADMIN | Liste utilisateurs. |
| GET | `/products` | non | — | Catalogue. |
| GET | `/products/:slug` | non | — | Fiche produit. |
| GET | `/products/search` | non | — | Recherche. |
| GET | `/categories` | non | — | Familles produits. |
| GET | `/cart` | oui | USER | Panier courant. |
| POST | `/cart/items` | oui | USER | Ajout au panier. |
| PATCH | `/cart/items/:id` | oui | USER | MAJ ligne panier. |
| DELETE | `/cart/items/:id` | oui | USER | Suppression ligne. |
| POST | `/payement` | oui | USER | Création PaymentIntent. |
| POST | `/payement/webhook` | non (signé) | — | Webhook Stripe. |
| GET | `/orders` | oui | USER | Commandes utilisateur. |
| GET | `/orders/:id` | oui | USER (owner) | Détail commande. |
| GET | `/subscriptions` | oui | USER | Abonnements actifs. |
| POST | `/subscriptions/:id/cancel` | oui | USER (owner) | Annulation. |
| GET | `/invoices` | oui | USER | Factures. |
| GET | `/addresses` | oui | USER | Adresses. |
| POST | `/addresses` | oui | USER | Ajout adresse. |
| GET | `/payment-methods` | oui | USER | Moyens de paiement. |
| POST | `/contact` | non | — | Formulaire de contact. |
| POST | `/chatbot/session` | non | — | Démarre une session chat. |
| POST | `/chatbot/session/:id/message` | non | — | Envoi message. |
| GET | `/admin-analytics/overview` | oui | ADMIN | Indicateurs dashboard. |
| GET | `/carousel` | non | — | Items carrousel. |
| GET | `/home-text-blocks` | non | — | Blocs textuels accueil. |

## Annexe F — Comptes de test

Comptes seedés dans la base de démonstration (à modifier avant toute mise en production réelle) :

| Rôle | Email | Notes |
|---|---|---|
| USER | demo@cyna.test | Utilisateur de test, panier exemple. |
| USER | jane@cyna.test | Utilisateur de test, abonnement actif. |
| ADMIN | admin@cyna.test | Admin, 2FA activée (secret de test). |

Les mots de passe par défaut sont documentés dans `cyna-vitrine/TEST_ACCOUNTS.md`. Ils doivent être changés avant toute mise en production.

Cartes Stripe de test : voir § 15.5.

## Annexe G — Bibliographie et références

- *Document de cadrage CPI DEV V2-2.pdf* — projet Fil Rouge.
- *Cahier des charges projet fil rouge — candidat — CPI 2024.docx*.
- *Guide_REX_Projet_CYNA.pdf*.
- *Exemple_DAT.pdf* — référence de structure.
- *Grille évaluation projet fil rouge — V27_2_25.xlsx* — barème.
- *CHECKLIST_IA_DAT_REX.md* — grille de relecture interne, versionnée dans le dépôt.
- Documentation officielle :
  - Next.js — https://nextjs.org/docs
  - NestJS — https://docs.nestjs.com
  - Prisma — https://www.prisma.io/docs
  - Stripe — https://stripe.com/docs
  - Expo — https://docs.expo.dev
  - PostgreSQL — https://www.postgresql.org/docs
  - OWASP Top 10 — https://owasp.org/Top10
  - WCAG 2.1 AA — https://www.w3.org/WAI/WCAG21/quickref/
- Bonnes pratiques sécurité :
  - PSD2 / 3DS — https://docs.stripe.com/strong-customer-authentication
  - RFC 6238 (TOTP) — https://www.rfc-editor.org/rfc/rfc6238
  - PCI-DSS — https://www.pcisecuritystandards.org

---

*Fin du document.*

*Auteur principal : François Baron. Relecture interne par l'équipe projet (Jessica, Emmanuel, Théo). Document soumis dans le cadre du livrable BC3 — projet Fil Rouge CPI DEV.*
