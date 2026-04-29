# REX - Retour d'experience projet CYNA - Jessica

Nom : A COMPLETER  
Prenom : Jessica  
Formation : CPI DEV  
Projet : Plateforme e-commerce CYNA  
Date : A COMPLETER

## 1. Presentation de mon role

Ce retour d'experience presente ma participation au projet CYNA, realise dans le cadre de la formation CPI DEV. Le projet consistait a concevoir une plateforme e-commerce pour une entreprise specialisee dans la cybersecurite, avec des offres autour du SOC, de l'EDR et du XDR.

Au sein de l'equipe, j'ai principalement travaille sur la partie backend, avec un perimetre centre sur l'authentification, la creation de comptes utilisateurs, la comprehension de la base de donnees et certaines interactions avec les fonctionnalites de paiement. Mon role n'etait pas de porter seule toute l'architecture backend, mais de contribuer progressivement a des briques techniques importantes, tout en apprenant a utiliser des outils que je ne maitrisais pas encore au depart.

Ce projet m'a placee dans une situation tres formatrice : je devais comprendre des technologies nouvelles, produire un travail utile pour l'equipe, et apprendre a integrer mes contributions dans un projet collectif. Mon experience chez Mewo et mon stage chez ARCUS m'ont aidee, car ils m'avaient deja donne des reflexes professionnels : lire une documentation, analyser une erreur, tester une hypothese et demander de l'aide lorsque le blocage persiste.

L'equipe etait composee de Francois, Emmanuel, Theo et moi-meme. Nous avons travaille avec Microsoft Teams pour les echanges, Trello pour le suivi des taches et GitHub pour le versionnement du code.

## 2. Travail realise

Mon travail a porte sur plusieurs aspects du backend.

J'ai participe a la mise en place de routes liees a l'inscription et a la connexion des utilisateurs. Cela m'a permis de mieux comprendre le fonctionnement d'une API NestJS, la validation des donnees envoyees par l'utilisateur, la gestion des erreurs cote serveur et la protection des informations sensibles comme les mots de passe.

J'ai egalement travaille sur la comprehension du systeme d'authentification avec JWT. Ce sujet etait nouveau pour moi. J'ai du comprendre comment un token est genere, transmis, puis verifie lors des requetes vers des routes protegees. Cette partie m'a aidee a mieux visualiser le lien entre le backend, le front et la session utilisateur.

Une autre partie importante de mon travail a concerne Prisma et la base de donnees PostgreSQL. J'ai participe a la definition ou a l'ajustement de certains modeles, notamment autour des utilisateurs et des donnees associees. J'ai aussi decouvert l'importance des migrations et des relations entre entites, qui peuvent vite devenir bloquantes si elles sont mal comprises.

J'ai enfin travaille sur la comprehension de l'integration Stripe. Cette partie m'a particulierement interessee, car elle reliait plusieurs notions : paiement, API externe, webhooks, et mise a jour de l'etat d'un utilisateur ou d'un abonnement en base de donnees. Je ne pretends pas maitriser parfaitement Stripe, mais le projet m'a permis de comprendre le fonctionnement general d'un paiement et les points d'attention associes.

Elements a completer avant rendu :

- Routes API ou modules principalement modifies : A COMPLETER.
- Modeles Prisma concernes : A COMPLETER.
- Exemple de bug ou blocage rencontre : A COMPLETER.
- Pull requests ou commits associes : A COMPLETER.

## 3. Difficultes rencontrees

La premiere difficulte technique a concerne Prisma ORM et les relations entre entites. Au depart, je comprenais les modeles de maniere separee, mais j'avais plus de mal a visualiser leurs relations dans une application complete : utilisateurs, produits, abonnements, paiements ou commandes. Certaines erreurs etaient difficiles a comprendre, car elles ne venaient pas toujours d'une seule ligne de code, mais d'une incoherence dans le schema ou dans la maniere d'appeler les donnees.

La deuxieme difficulte a concerne Stripe et les webhooks. Comprendre le cycle de vie d'un paiement n'etait pas evident : une action cote utilisateur peut declencher un evenement chez Stripe, qui doit ensuite etre recu par le backend et produire une mise a jour fiable dans la base de donnees. Les tests en local m'ont aidee a comprendre ce fonctionnement, mais ils demandaient de la rigueur et du temps.

J'ai aussi rencontre des difficultes avec GitHub, les push, les merges et l'integration du travail dans le projet commun. Avant ce projet, je n'avais pas encore pleinement mesure la difference entre faire fonctionner quelque chose localement et l'integrer proprement dans un depot partage. Un code peut fonctionner sur son poste mais poser probleme lorsqu'il est pousse, relu, fusionne ou lance dans un autre environnement.

La difference entre le local et l'heberge a egalement ete formatrice. Chaque membre devait installer les outils, les dependances et les variables necessaires de son cote. Cela rendait parfois les resultats difficiles a comparer : une fonctionnalite pouvait sembler fonctionner chez une personne, mais pas chez une autre. J'ai compris que le developpement ne s'arrete pas au fait que "cela marche chez moi" ; il faut aussi pouvoir expliquer, reproduire et integrer.

Enfin, la communication dans l'equipe n'a pas toujours ete simple. Certains changements ou validations etaient parfois difficiles a suivre, surtout lorsqu'ils etaient faits rapidement ou sans explication complete. Cela m'a obligee a m'adapter, a verifier plus souvent l'etat du code et a demander des precisions lorsque je ne comprenais pas l'impact d'une modification. Cette difficulte m'a appris l'importance de traces concretes : taches a jour, branches claires, pull requests lisibles et validations explicites.

## 4. Solutions mises en place

Pour progresser sur Prisma, j'ai adopte une approche par etapes. J'ai relu la documentation officielle, en particulier les parties sur les relations entre modeles, puis j'ai reproduit des cas simples dans un environnement de test avant de les appliquer au projet. Cette methode m'a aidee a comprendre progressivement les erreurs au lieu de modifier plusieurs choses en meme temps sans savoir ce qui fonctionnait.

Pour Stripe, j'ai utilise Stripe CLI afin de simuler des evenements localement et observer le comportement des webhooks. Cela m'a permis de mieux comprendre le cycle d'un paiement et d'identifier les points de blocage. J'ai aussi consulte des exemples et de la documentation pour comparer ma comprehension avec des cas existants.

Pour GitHub, j'ai appris a etre plus attentive aux branches, aux commits et aux merges. J'ai compris qu'il fallait verifier ce que je poussais, lire les changements des autres et ne pas considerer une tache comme terminee tant qu'elle n'etait pas integree proprement dans le projet commun. Cette decouverte a ete importante, car elle fait partie du travail reel en equipe.

Pour mieux gerer mon apprentissage, j'ai progressivement appris a distinguer les taches que je pouvais faire directement de celles qui demandaient une phase d'exploration. Au lieu de dire simplement qu'une tache etait en cours, j'ai compris qu'il fallait aussi signaler lorsqu'une partie demandait d'abord de comprendre une technologie ou un outil. Cela permet a l'equipe de mieux anticiper les delais et les dependances.

## 5. Competences acquises

Le projet CYNA m'a permis de progresser techniquement, mais aussi dans ma maniere d'aborder un probleme.

| Competence | Niveau avant le projet | Niveau apres le projet |
| --- | --- | --- |
| NestJS | Decouverte | Capable de comprendre et adapter une route simple |
| Prisma ORM | Decouverte | Meilleure comprehension des modeles et relations |
| PostgreSQL | Bases limitees | Meilleure lecture de la structure de donnees |
| JWT / authentification | Decouverte | Compréhension du principe et des etapes principales |
| Stripe / webhooks | Decouverte | Capable de suivre un exemple et comprendre le cycle general |
| Git / merges / push | Usage limite | Plus attentive a l'integration collective |

Je ne dirais pas que je maitrise parfaitement tous ces sujets. En revanche, je sais beaucoup mieux comment les reprendre. Le fait de pratiquer, de me tromper, de lire les messages d'erreur et de trouver progressivement des solutions me permettrait aujourd'hui de refaire certaines etapes avec plus de methode et de savoir plus rapidement ou chercher lorsqu'un bug apparait.

Sur le plan transversal, j'ai surtout progresse en autonomie. Face aux blocages techniques, j'ai appris a ne pas rester passive : chercher par moi-meme, tester une solution, consulter la documentation, puis solliciter l'equipe lorsque j'avais besoin d'un regard supplementaire. Cette progression est importante pour moi, car elle montre que je suis capable d'apprendre dans un contexte concret, avec des contraintes de delai et de qualite.

## 6. Travail en equipe

Le travail en equipe a ete une partie importante du projet. Nous utilisions Teams pour communiquer, Trello pour suivre les taches et GitHub pour integrer le code. Ces outils nous ont aide a structurer le projet, mais j'ai compris qu'ils ne remplacent pas une communication claire et reguliere.

Dans la pratique, certains membres etaient plus autonomes techniquement que d'autres. Cela pouvait etre positif pour faire avancer le projet, mais cela demandait aussi de s'adapter lorsque des changements etaient faits rapidement ou lorsqu'une decision technique n'etait pas assez expliquee. Pour moi, cette situation a ete formatrice, car elle m'a obligee a mieux suivre l'evolution du code et a poser des questions plus precises.

Une difficulte a ete de comprendre l'impact des modifications des autres sur mon propre travail. Lorsqu'une branche evolue, qu'une structure de donnees change ou qu'une route API est modifiee, cela peut avoir des consequences sur plusieurs parties du projet. J'ai compris qu'il fallait regarder le projet comme un ensemble, et pas seulement comme une suite de taches individuelles.

Le moment de collaboration le plus marquant pour moi a ete l'assemblage des briques developpees separement : backend, base de donnees, authentification et interface. C'est a ce moment que j'ai vraiment compris l'interdependance des roles. Une fonctionnalite ne vaut pas seulement parce qu'elle fonctionne localement, mais parce qu'elle peut etre integree, testee et comprise par les autres.

## 7. Bilan personnel

Ce projet a ete une experience exigeante, car il m'a confrontee a des technologies et a des methodes de travail que je ne maitrisais pas encore. Prisma, JWT, Stripe, GitHub et les merges etaient des sujets parfois intimidants au depart. Le projet m'a obligee a les aborder de maniere concrete, avec des erreurs, des recherches, des tests et des corrections.

Ce que je retiens le plus, c'est l'importance de la methode. Avant de vouloir resoudre un probleme rapidement, il faut comprendre ce qui bloque, isoler le probleme, tester une hypothese et seulement ensuite l'appliquer au projet. Cette maniere de travailler me semble plus solide que de copier une solution sans la comprendre.

Si je devais refaire ce projet, je prendrais davantage de temps en amont pour :

- identifier les technologies que je dois apprendre avant de commencer a coder ;
- mieux estimer les taches qui demandent une phase de decouverte ;
- verifier plus souvent l'integration de mon travail avec celui des autres ;
- demander plus tot une clarification lorsqu'une modification me semble floue ;
- garder davantage de traces sur les bugs rencontres et les solutions trouvees.

Ma progression globale sur ce projet : 7/10.

Je justifie cette note par le fait que j'ai surmonte des difficultes techniques que je ne pensais pas pouvoir traiter au depart, tout en restant impliquee dans le travail d'equipe. Je garde une marge de progression sur l'anticipation, l'estimation du temps d'apprentissage et la maitrise complete des outils backend. Ce projet m'a surtout permis de gagner en confiance : je sais maintenant que je peux progresser sur un sujet complexe si je l'aborde avec methode, documentation et communication.
