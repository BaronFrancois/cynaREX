# Alignement document de cadrage CPI DEV ↔ implémentation

Référence : *Document de cadrage CPI DEV V2-2* (projet Fil Rouge Cyna).  
Code : `cyna-vitrine` (Next.js) + `cyna-api` (NestJS / API).

---

## 1. Synthèse exigences ↔ code

| § Cadrage | Exigence | Statut | Où c’est dans le repo | Notes |
|-----------|----------|--------|------------------------|-------|
| **I.1 / II.2.1** | Plateforme e-commerce **mobile-first** | Partiel | `src/app/**/*.tsx`, `globals.css` | Responsive ; pas d’app Cordova (hors cadrage initial). |
| **II.2.1** | **Identité** : couleurs logo + esprit [cyna-it.fr](https://cyna-it.fr/) | En cours | `globals.css` (`--cyna-*`), `CynaLogo.tsx`, `AppHeader.tsx`, `Button.tsx` | Variables **violet / magenta**, logo **C** en dégradé ; à affiner avec asset officiel si fourni. |
| **II.2.1** | Catalogue **5–7 produits phares** | OK (démo) | `constants.ts` (`PRODUCTS`) | **6** offres libellées d’après [cyna-it.fr](https://cyna-it.fr/) (tarifs fictifs). |
| **II.2.1** | **3 catégories** (SOC, EDR, XDR) | OK | `catalog/page.tsx`, `constants.ts`, `types/produit.ts` | Filtres : Tous + EDR, XDR, SOC. Produits Cloud / Network retirés. |
| **II.2.1** | **Chatbot** : FAQ + saisie libre | Partiel | `lib/supportFaq.ts`, `support/page.tsx`, `geminiService.ts` | **FAQ** + correspondance mots-clés **avant** appel Gemini ; API Nest `chatbot/*` disponible pour évolution. |
| **II.2.1** | Paiement **Stripe + PayPal** | Partiel | `checkout/page.tsx`, `cyna-api/src/v1/payement/*` | **Stripe** OK. **PayPal** : pas via Stripe (voir § PayPal ci-dessous). |
| **II.2.1** | **Back-office** | Partiel | `cyna-api` routes `ADMIN` | **Swagger** pour exposer / tester l’admin API. |
| **II.2.1** | Base **MariaDB** + schéma | OK (API) | `cyna-api/prisma/*` | |
| **IV.4.1** | Stack Vue / Cordova / Koa | Écart documentaire | — | Réalisation **Next.js** + NestJS — à expliquer en soutenance. |
| **—** | **Recherche** catalogue | OK (vitrine) | `AppSearch.tsx`, `constants.ts` | Recherche sur **`PRODUCTS`** + liens rapides (pages). Option : brancher `GET /products` si catalogue 100 % API. |

---

## 2. PayPal : simple ou via Stripe ?

- **Stripe ne remplace pas PayPal** : ce sont deux acquéreurs distincts. Stripe propose Apple Pay / Google Pay / Link, mais **pas** PayPal comme méthode native au même titre qu’une simple option “PayPal”.
- **Moyens simples d’ajouter PayPal** :
  1. **PayPal Checkout / Smart Buttons** (JS SDK) : bouton à côté du flux Stripe, redirection ou popup PayPal, puis webhook PayPal pour confirmer la commande côté API.
  2. **Braintree** (groupe PayPal) : une seule intégration multi-moyens — plus lourd pour un MVP.
- **Recommandation projet** : garder **Stripe pour carte** ; ajouter **PayPal Buttons** en parallèle sur le checkout si le cadrage exige explicitement PayPal, avec un endpoint dédié `POST /payement/paypal` + webhook.

---

## 3. Fichiers utiles

| Sujet | Fichiers principaux |
|--------|---------------------|
| Charte & logo | `src/app/globals.css`, `src/components/CynaLogo.tsx`, `AppHeader.tsx` |
| Produits & catégories | `constants.ts`, `src/app/catalog/page.tsx`, `src/app/product/[slug]/page.tsx` |
| Recherche | `src/components/AppSearch.tsx` |
| FAQ / chat | `src/lib/supportFaq.ts`, `src/app/support/page.tsx` |
| Paiement | `src/app/checkout/page.tsx`, `cyna-api/src/v1/payement/` |
| Admin API | Swagger Nest sur `cyna-api` (ex. `/api` selon config) |

---

## 4. Matrice RACI (extrait Annexe C du cadrage)

Légende : **R** = réalise, **A** = approuve (formateur), **C** = consulté, **I** = informé.

| Activité | Arthur | Thanh | Melusine | Khadiatou | Thomas | Formateur |
|----------|--------|-------|----------|-----------|--------|-----------|
| Contexte, enjeux, objectifs | R | I | I | I | I | A |
| Catalogue & catégories | I | R | C | I | I | A |
| Choix techno front & architecture | I | R | C | I | I | A |
| KPIs / perf mobile | I | I | R | I | I | A |
| Intégration paiement | I | I | I | R | I | A |
| Schéma BDD | I | I | I | I | R | A |
| Déploiement serveur | I | I | I | I | R | A |
| Doc & versioning (Git/Trello) | C | C | C | C | C | A |

---

## 5. Liste de contrôle “soutenance”

- [ ] Justifier l’écart de stack (Next vs Vue/Cordova du document).
- [ ] Charte + logo : variables CSS + `CynaLogo` (ou export PNG/SVG officiel).
- [ ] Recherche : `AppSearch` + `PRODUCTS` (ou API).
- [ ] 3 catégories + nombre de produits (3 vs 5–7 cadrage).
- [ ] PayPal : stratégie (SDK + webhook) ou hors périmètre documenté.
- [ ] Chatbot : FAQ + `matchPredefinedAnswer` + Gemini en secours ; API Nest optionnelle.
- [ ] Démo : **Swagger** pour l’admin API.

---

## 6. Mise à jour CDCF (plan de conformité)

- **Accueil** : carrousel, blocs texte, catégories et produits vedettes branchés sur l’API publique (`publicFetch`, `cyna-api` carousel / home-text-blocks / categories / products).
- **Recherche** : `GET /products/search`, indexes PostgreSQL (`pg_trgm`), page `/search` et pagination catalogue.
- **Checkout** : Stripe (Elements / PaymentIntent) ; PayPal documenté comme option complémentaire ; gestion des lignes panier indisponibles.
- **Compte** : commandes, abonnements, adresses, moyens de paiement via routes API authentifiées.
- **Back-office** : application `cyna-admin` (tableaux, analytics) + **2FA TOTP** admin (`otplib` v13, routes setup/confirm).
- **i18n** : contexte `I18nProvider` (FR / EN), `lang` sur `<html>`, libellés shell (header, footer, recherche, carrousel). Thème **sombre uniquement** (`forcedTheme="dark"`).
- **Accessibilité** : carrousel (région, `aria-live`, masquage des diapos inactives) ; formulaire contact (`htmlFor`, `aria-invalid`, `role="alert"`) ; modale chat (`role="dialog"`, `aria-modal`, libellés boutons).
- **Mobile** : dossier `cyna-mobile` (Expo) listant les catégories via l’API — second dépôt Git possible.
- **Documentation livrables** : `docs/CDCF-LIVRABLES.md` (installation, Swagger, canevas DCT, SPA, stack mobile).

---

*Document à mettre à jour à chaque itération.*
