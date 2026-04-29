# Checklist IA - DAT et REX CYNA

Ce document sert de grille de controle avant redaction et avant relecture finale.
Il permet a une IA, ou a un relecteur humain, de verifier que le DAT et les REX respectent les attentes du projet CYNA, du guide REX et du bareme.

Sources de reference identifiees :

- `Grille evaluation projet fil rouge - V27_2_25.xlsx`
- `notation_dat.png`
- `notation_rex.png`
- `Guide_REX_Projet_CYNA.pdf`
- `Exemple_DAT.pdf`
- `Document de cadrage CPI DEV V2-2.pdf`
- `Cahier des charges projet fil rouge- candidat - CPI 2024.docx`
- Depots projet : `cyna-vitrine`, `cyna-api`, `Cyna_mobile`, `backup`

## 1. Regles Generales A Respecter

### 1.1 Transparence

- Ne pas presenter le projet comme parfaitement termine si certaines parties sont partielles.
- Expliquer les ecarts entre le cadrage initial et la realisation finale.
- Mentionner clairement l'existence du backup utilise pour la demonstration.
- Transformer les difficultes en analyse professionnelle : risque, decision, consequence, solution.

### 1.2 Tracabilite

Chaque affirmation importante doit pouvoir etre reliee a une preuve :

- fichier du projet ;
- capture d'ecran ;
- route API ;
- composant front ;
- schema ;
- commit GitHub ;
- support de soutenance ;
- document de cadrage ;
- test ou commande de validation.

### 1.3 Ton attendu

- DAT : ton technique, structure, factuel, professionnel.
- REX : ton personnel, honnete, reflexif, concret.
- Ne pas copier les formulations entre les REX des membres du groupe.
- Eviter les phrases vagues : "j'ai aide", "j'ai travaille sur le projet", "j'ai appris des choses".

## 2. Checklist REX - Quatrieme Rendu BC2

Bareme total : 50 points.
Poids dans l'evaluation du bloc 2 "Coordonner une equipe projet" : 20 %.

### 2.1 Reflexion personnelle sur les defis rencontres - 10 points

Attendus :

- Identifier des difficultes reelles, techniques et/ou organisationnelles.
- Expliquer le contexte exact : quand, pourquoi, impact.
- Ne pas se limiter a dire que le projet etait difficile.
- Montrer une prise de recul personnelle.

Elements a verifier :

- Le REX cite au moins une difficulte technique precise.
- Le REX cite au moins une difficulte organisationnelle ou humaine.
- Le REX explique l'impact sur le projet ou sur la personne.
- Le REX ne cherche pas a masquer les problemes importants.

Preuves ou exemples possibles :

- projet principal instable avant la soutenance ;
- necessite de preparer un backup ;
- difficultes liees au deploiement ou a l'environnement ;
- differences de niveau technique dans l'equipe ;
- apprentissage progressif de Jessica et Emmanuel ;
- gestion de la pression avant la demo.

### 2.2 Capacite a identifier ses forces et faiblesses - 10 points

Attendus :

- Identifier clairement ce qui a bien fonctionne.
- Identifier les limites personnelles.
- Montrer une progression entre le debut et la fin du projet.
- Ne pas transformer le REX en auto-promotion.

Elements a verifier :

- Le REX contient une section forces/faiblesses ou equivalent.
- Les forces sont reliees a des actions concretes.
- Les faiblesses sont formulees avec maturite.
- Les limites sont accompagnees de pistes d'amelioration.

Pour Francois, pistes probables :

- Force : capacite a reprendre, stabiliser et heberger une version fonctionnelle pour la demo.
- Force : comprehension globale front/back/deploiement.
- Faiblesse : charge trop centralisee, anticipation insuffisante de la stabilite finale, documentation possiblement tardive.
- Axe de progression : mieux repartir les responsabilites et mettre en place plus tot des jalons de validation.

### 2.3 Analyse des competences developpees - 10 points

Attendus :

- Distinguer competences techniques et transversales.
- Comparer le niveau avant/apres.
- Citer des technologies et pratiques precises.

Elements a verifier :

- Le REX mentionne des competences techniques concretes.
- Le REX mentionne des competences de gestion de projet ou collaboration.
- Le REX explique comment ces competences ont ete acquises.

Competences techniques possibles :

- Next.js / React / TypeScript ;
- NestJS / API REST ;
- Prisma / base de donnees ;
- authentification, roles, securite ;
- Stripe ;
- deploiement et variables d'environnement ;
- structuration d'un projet multi-depots.

Competences transversales possibles :

- coordination ;
- priorisation ;
- adaptation sous contrainte ;
- communication avec des profils debutants ;
- gestion de crise avant soutenance ;
- pedagogie envers Jessica et Emmanuel.

### 2.4 Proposition d'axes d'amelioration pour de futurs projets - 10 points

Attendus :

- Proposer des ameliorations realistes.
- Relier les ameliorations aux problemes vecus.
- Montrer que l'experience produit une methode plus mature.

Elements a verifier :

- Le REX propose au moins 3 axes d'amelioration.
- Les axes ne sont pas generiques.
- Les axes couvrent la technique et l'organisation.

Axes possibles :

- valider un MVP deployable plus tot ;
- mettre en place une integration continue minimale ;
- definir des contrats API avant developpement ;
- documenter l'installation des le depart ;
- reserver du temps pour tests et correction avant soutenance ;
- mieux adapter les taches au niveau de chaque membre ;
- organiser des points de formation pour les membres debutants.

### 2.5 Qualite de la redaction et clarte du document - 10 points

Attendus :

- REX lisible, structure, personnel.
- Longueur recommandee par le guide : 2 a 4 pages.
- Sections attendues presentes.
- Style clair, sans remplissage.

Structure REX a respecter :

1. Presentation du role.
2. Travail realise.
3. Difficultes rencontrees.
4. Solutions mises en place.
5. Competences acquises.
6. Travail en equipe.
7. Bilan personnel.

Elements a verifier :

- Le REX est redige a la premiere personne.
- Les exemples sont personnels et precis.
- Le document n'est pas identique aux REX des autres membres.
- Les phrases vagues sont remplacees par des faits.

## 3. Checklist DAT - Cinquieme Rendu BC3

Bareme total : 50 points.
Poids dans l'evaluation du bloc 3 "Superviser la mise en oeuvre d'un projet informatique" : 100 %.

### 3.1 Implementations techniques livrees - 10 points

Attendus :

- Decrire les systemes, reseaux ou applications logicielles livres.
- Montrer la conformite aux specifications.
- Evaluer le niveau de detail fourni.
- Justifier les elements livres et les elements partiels.

Elements a verifier :

- Le DAT presente clairement les applications livrees.
- Le DAT distingue projet principal, backup et mobile.
- Le DAT liste les fonctionnalites realisees, partielles et non realisees.
- Le DAT relie chaque fonctionnalite au besoin initial.

Applications a documenter :

- `cyna-vitrine` : vitrine e-commerce Next.js.
- `cyna-api` : API NestJS.
- `Cyna_mobile` : application mobile Expo, si perimetre conserve.
- `backup` : version de secours utilisee pour demonstration.

Fonctionnalites a verifier :

- accueil ;
- catalogue produits ;
- categories SOC / EDR / XDR ;
- pages produit ;
- panier ;
- checkout / paiement Stripe ;
- compte utilisateur ;
- authentification ;
- contact ;
- support / chatbot ;
- back-office ou routes admin ;
- factures, commandes, abonnements si presentes ;
- recherche ;
- responsive / mobile-first.

### 3.2 Pertinence et clarte des schemas techniques - 10 points

Attendus :

- Fournir des schemas utiles et exploitables.
- Evaluer reseau, systeme, architecture logicielle et UML si necessaire.
- Montrer que les schemas expliquent vraiment la solution.

Schemas recommandes :

- schema d'architecture globale ;
- schema des flux front -> API -> base de donnees ;
- schema d'authentification ;
- schema du paiement Stripe ;
- schema de deploiement ;
- modele de donnees / MCD ou equivalent Prisma ;
- diagramme de sequence pour commande/paiement ;
- diagramme de cas d'utilisation ;
- schema de backup de demonstration.

Elements a verifier :

- Chaque schema a un titre, une legende et une explication.
- Les schemas correspondent au projet reel, pas seulement au cadrage initial.
- Les schemas sont cites dans le texte.
- Les choix techniques sont justifies apres les schemas.

### 3.3 Qualite des tests techniques et resultats documentes - 10 points

Attendus :

- Documenter les tests techniques.
- Couvrir securite, resilience et performance si possible.
- Fournir des preuves de conformite aux attentes projetees.

Elements a verifier :

- Le DAT contient une strategie de test.
- Le DAT contient des resultats observes, pas seulement des intentions.
- Le DAT precise les limites des tests.
- Les tests sont relies aux exigences du projet.

Tests a documenter :

- lancement front ;
- build front ;
- lancement API ;
- tests unitaires/e2e si disponibles ;
- test des routes API via Swagger ou outil equivalent ;
- test authentification ;
- test panier ;
- test checkout ;
- test contact ;
- test responsive ;
- test du backup ;
- verification TypeScript ;
- verification lint si applicable.

Preuves possibles :

- captures terminal ;
- captures Swagger ;
- captures interface ;
- commandes executees ;
- resultats de build ;
- comptes de test ;
- liste des bugs connus.

### 3.4 Organisation et structuration du document - 5 points

Attendus :

- Document clair, logique, facile a lire.
- Introduction, descriptions techniques, annexes.
- Structure adaptee a un document de plus de 50 pages.

Elements a verifier :

- Sommaire present.
- Numerotation coherente.
- Sections techniques bien separees.
- Annexes utiles.
- Glossaire si necessaire.
- Captures et schemas lisibles.

Structure DAT recommandee :

1. Page de garde.
2. Historique du document.
3. Resume executif.
4. Contexte et objectifs.
5. Perimetre fonctionnel.
6. Organisation projet.
7. Architecture generale.
8. Frontend.
9. Backend/API.
10. Base de donnees.
11. Securite.
12. Paiement.
13. Mobile.
14. Deploiement.
15. Backup de demonstration.
16. Tests et validation.
17. Risques et limites.
18. Maintenance et evolutions.
19. Conclusion.
20. Annexes.

### 3.5 Gestion de la securite et conformite - 5 points

Attendus :

- Justifier les mesures de securite.
- Montrer la prise en compte de normes ou references : RGPD, ISO 27001, etc.
- Expliquer la protection des donnees et transactions.

Elements a verifier :

- Authentification documentee.
- Roles/utilisateurs documentes.
- Mots de passe et secrets non exposes.
- Variables d'environnement expliquees.
- Paiement Stripe explique.
- RGPD aborde : donnees personnelles, conservation, droits utilisateurs.
- Risques securite listes.

Points CYNA a traiter :

- domaine cybersecurite donc exigence de credibilite accrue ;
- donnees utilisateurs ;
- commandes et paiements ;
- back-office/admin ;
- chatbot ou messages support ;
- logs et erreurs ;
- distinction entre environnement local, demo et production.

### 3.6 Scalabilite et performance - 5 points

Attendus :

- Documenter les strategies d'evolution.
- Montrer comment l'application pourrait monter en charge.
- Parler d'auto-scaling, monitoring ou gestion des ressources si pertinent.

Elements a verifier :

- Le DAT explique les limites actuelles.
- Le DAT propose une evolution realiste.
- Le DAT distingue ce qui est implemente et ce qui est recommande.

Axes possibles :

- hebergement front sur plateforme compatible Next.js ;
- hebergement API separe ;
- base de donnees managée ;
- monitoring applicatif ;
- logs centralises ;
- cache catalogue ;
- pagination recherche ;
- separation environnements dev/demo/prod ;
- CI/CD ;
- strategy de rollback.

### 3.7 Respect des delais et conformite aux exigences initiales - 3 points

Attendus :

- Comparer le livrable au cahier des charges.
- Expliquer les ecarts.
- Montrer que les contraintes de temps ont ete gerees.

Elements a verifier :

- Matrice exigences initiales -> realisation presente.
- Statut par exigence : OK, partiel, non realise, hors perimetre.
- Justification des ecarts.
- Mention du backup comme reponse au risque de demo.

Exigences initiales a comparer :

- plateforme e-commerce mobile-first ;
- identite visuelle Cyna ;
- catalogue 5 a 7 produits ;
- categories SOC / EDR / XDR ;
- chatbot FAQ + saisie libre ;
- paiement Stripe + PayPal ;
- back-office ;
- base de donnees relationnelle ;
- outils collaboratifs ;
- documentation et installation.

### 3.8 Gouvernance et vision d'evolution - 2 points

Attendus :

- Inclure une reflexion sur l'avenir de l'infrastructure ou des applications.
- Fournir une roadmap de maintenance ou evolution.

Elements a verifier :

- Roadmap presente.
- Maintenance corrective et evolutive expliquee.
- Dette technique identifiee.
- Prochaines etapes priorisees.

Roadmap possible :

- stabiliser le projet principal ;
- finaliser PayPal ou documenter son report ;
- renforcer les tests ;
- industrialiser le deploiement ;
- ameliorer le back-office ;
- finaliser le mobile ;
- renforcer securite et RGPD ;
- documenter davantage l'exploitation.

## 4. Points Sensibles A Traiter Avec Soin

### 4.1 Ecart de stack technique

Le cadrage initial mentionne une stack de type Vue / Cordova / Koa / MariaDB.
Le projet observe utilise notamment :

- Next.js / React / TypeScript pour `cyna-vitrine` ;
- NestJS pour `cyna-api` ;
- Prisma ;
- Expo pour `Cyna_mobile`.

Verification attendue :

- Le DAT doit expliquer pourquoi ces choix ont ete faits ou comment ils sont apparus.
- Le DAT ne doit pas faire semblant que la stack initiale a ete respectee si ce n'est pas le cas.
- Le REX peut expliquer la difficulte de maintenir l'alignement entre cadrage et implementation.

### 4.2 Backup de demonstration

Point important du projet :

- Le projet principal ne fonctionnait pas correctement avant l'oral.
- Une solution de backup a ete preparee pour pouvoir heberger et demontrer une version fonctionnelle.

Verification attendue :

- Le DAT presente le backup comme mesure de gestion de risque.
- Le REX de Francois explique le vecu personnel : pression, decision, actions concretes, apprentissage.
- Le ton reste professionnel : il ne s'agit pas d'accuser, mais d'analyser.

### 4.3 Contributions de Jessica et Emmanuel

Contexte connu :

- Jessica et Emmanuel ont debute la programmation recemment.
- Leur apport principal releve davantage de l'apprentissage et de la participation que de la production technique lourde.

Verification attendue :

- Les REX doivent rester personnels.
- Ne pas inventer des contributions techniques fortes si elles n'existent pas.
- Valoriser leur progression, leurs apprentissages, leur participation aux tests, a la comprehension, a la documentation ou aux echanges.
- Pour le DAT, ne pas surattribuer des modules techniques.

## 5. Methode De Verification IA

Pour chaque document produit, l'IA doit verifier :

1. Le document repond-il explicitement aux criteres du bareme ?
2. Chaque critere a-t-il une section dediee ou identifiable ?
3. Les affirmations importantes sont-elles prouvees ?
4. Les ecarts au cadrage sont-ils expliques ?
5. Le backup de demonstration est-il traite avec transparence ?
6. Les limites du projet sont-elles formulees sans affaiblir le livrable ?
7. Le vocabulaire est-il professionnel ?
8. Les REX sont-ils personnels et differencies ?
9. Le DAT depasse-t-il la simple liste de fichiers ?
10. Les annexes renforcent-elles vraiment le document ?

## 6. Grille De Relecture Rapide

Avant rendu du REX :

- [ ] 7 sections du guide presentes.
- [ ] Longueur entre 2 et 4 pages.
- [ ] Ton personnel a la premiere personne.
- [ ] Difficultes concretes.
- [ ] Solutions concretes.
- [ ] Competences techniques et humaines.
- [ ] Axes d'amelioration.
- [ ] Aucun copier-coller entre membres.

Avant rendu du DAT :

- [ ] Plus de 50 pages visees.
- [ ] Sommaire present.
- [ ] Contexte CYNA clair.
- [ ] Perimetre reel explique.
- [ ] Architecture globale schematisee.
- [ ] Front documente.
- [ ] API documentee.
- [ ] Base de donnees documentee.
- [ ] Securite documentee.
- [ ] Tests documentes.
- [ ] Deploiement documente.
- [ ] Backup documente.
- [ ] Matrice de conformite aux exigences.
- [ ] Roadmap et maintenance.
- [ ] Annexes exploitables.

## 7. Prochaine Etape - REX Francois

Informations a collecter avant redaction :

- Role exact de Francois dans l'equipe.
- Taches realisees personnellement.
- Modules ou fichiers principalement modifies.
- Niveau avant/apres sur les technologies.
- Difficultes techniques principales.
- Difficultes d'organisation.
- Actions menees pour le backup de demo.
- Ressenti sur la soutenance.
- Ce que Francois ferait differemment.
- Ce que le projet lui a appris professionnellement.

