# REX - Retour d'experience projet CYNA - Emmanuel

Nom : A COMPLETER  
Prenom : Emmanuel  
Formation : CPI DEV  
Projet : Plateforme e-commerce CYNA  
Date : A COMPLETER

## 1. Presentation de mon role

Ce retour d'experience presente ma participation au projet CYNA, realise dans le cadre de la formation CPI DEV. Le projet avait pour objectif de concevoir une plateforme e-commerce pour une entreprise specialisee dans la cybersecurite, avec des offres autour du SOC, de l'EDR et du XDR.

Au sein de l'equipe, j'ai principalement travaille sur la partie backend. Mon role peut etre resume comme celui d'un referent backend sur certaines briques du projet, notamment l'architecture API, l'authentification et la structuration de certains modules. Je ne considere pas avoir exerce ce role comme le ferait un lead developpeur experimente en entreprise, mais plutot comme un etudiant qui a essaye d'endosser cette responsabilite a son niveau, avec ses connaissances du moment et une progression au fil des sprints.

Ce role m'a demande de sortir de ma posture habituelle. Je suis quelqu'un d'assez discret, et le projet m'a oblige a communiquer davantage, a expliquer certains choix techniques, a demander des retours et a accepter que je n'avais pas toujours les reponses immediatement. Cette dimension humaine a ete aussi importante que la partie technique.

L'equipe etait composee de Jessica, Francois, Theo et moi-meme. Nous avons utilise des outils comme Microsoft Teams, Trello et GitHub pour organiser le travail, suivre les taches et integrer progressivement les contributions de chacun.

## 2. Travail realise

Mon travail a principalement porte sur la partie backend du projet CYNA. J'ai participe a la structuration de l'API avec NestJS, en cherchant a organiser le code par domaines fonctionnels afin de rendre le projet plus lisible et plus facile a maintenir. Cette organisation concernait notamment les parties liees aux utilisateurs, aux produits, aux abonnements et aux paiements.

J'ai egalement travaille sur la logique d'authentification. Cela comprenait la comprehension et la mise en place de mecanismes autour des tokens JWT, des guards NestJS et du controle d'acces aux routes protegees. Ce sujet a ete formateur, car il demandait de comprendre le cycle d'une requete, la verification d'un utilisateur et la gestion des droits selon les profils.

Une autre partie importante de mon travail a concerne la base de donnees. J'ai collabore avec Jessica sur la comprehension des modeles Prisma, des relations entre entites et de la coherence generale des donnees. Cette collaboration a permis de mieux comprendre comment les choix faits en base influencaient ensuite les routes API et les fonctionnalites cote application.

J'ai aussi participe a la revue et a l'integration de certaines contributions. Dans les faits, cela n'a pas toujours ete parfaitement formalise. Certaines decisions etaient discutees oralement ou dans les outils de suivi, mais toutes n'ont pas ete documentees aussi proprement qu'elles auraient du l'etre. Avec le recul, c'est un point important : une decision technique utile doit pouvoir etre retrouvee, comprise et justifiee par l'equipe.

Elements a completer avant rendu :

- Modules NestJS principalement modifies : A COMPLETER.
- Routes API ou fonctionnalites traitees : A COMPLETER.
- Pull requests ou commits associes : A COMPLETER.
- Exemple precis de decision technique prise ou discutee : A COMPLETER.

## 3. Difficultes rencontrees

La premiere difficulte a ete d'endosser un role de referent backend sans experience prealable sur ce type de responsabilite. Il fallait contribuer techniquement tout en aidant l'equipe a garder une direction coherente. Au debut, cette position etait delicate, car je devais parfois donner un avis ou proposer une organisation alors que j'etais moi-meme en apprentissage sur certains sujets.

La difficulte technique principale a concerne NestJS et la securisation des routes. Le framework repose sur des concepts comme les modules, les services, les decorateurs, l'injection de dependances et les guards. Comprendre comment ces elements fonctionnent ensemble m'a demande du temps. La mise en place des controles d'acces avec JWT et les guards m'a particulierement fait progresser, car elle oblige a relier la theorie de l'authentification avec une implementation concrete.

Une autre difficulte a ete la coordination. Dans un projet collectif, il ne suffit pas que chacun avance de son cote. Il faut aussi que le travail soit comprehensible, partageable et integrable. Certaines contributions ou decisions etaient parfois difficiles a suivre, car elles n'etaient pas toujours expliquees en amont ou reliees clairement aux taches du sprint. Cela pouvait creer un ecart entre ce qui etait annonce, ce qui etait reellement integre dans le projet et ce que le reste de l'equipe comprenait.

Cette situation m'a appris qu'une equipe ne peut pas fonctionner uniquement sur la confiance ou sur des annonces d'avancement. Il faut des traces concretes : taches a jour, branches propres, pull requests comprehensibles, validations partagees et points reguliers sur ce qui est reellement integre. Ce n'est pas une critique individuelle, mais un apprentissage important sur la difference entre une organisation theorique et la realite d'un projet informatique.

Enfin, j'ai parfois eu tendance a vouloir garder une vision globale sur trop de sujets. Mon intention etait de rester coherent avec le role que j'essayais de tenir, mais cela pouvait me faire perdre en efficacite sur mes propres taches. J'ai compris qu'un role de referent ne consiste pas a tout controler, mais a aider l'equipe a avancer avec des informations claires et partagees.

## 4. Solutions mises en place

Pour faire face a mon manque d'experience dans ce role, j'ai avance progressivement. Lorsque je ne savais pas trancher immediatement, j'ai pris le temps de verifier la documentation, de comparer plusieurs solutions ou de demander un avis avant de figer une decision. Cette posture m'a permis d'eviter de presenter mes choix comme des certitudes alors qu'ils etaient parfois encore en construction.

J'ai egalement essaye de clarifier les decisions techniques autant que possible, notamment dans nos echanges, dans Trello ou lors des points d'equipe. Avec le recul, cette demarche aurait du etre plus systematique et plus formelle. Par exemple, certaines decisions d'architecture auraient pu etre regroupees dans un document dedie, avec la raison du choix, son impact et les modules concernes.

Sur la partie NestJS et authentification, j'ai progresse en decomposant les problemes : comprendre d'abord le fonctionnement des modules, puis celui des services, puis celui des guards et enfin l'integration avec JWT. Cette approche m'a permis de ne pas traiter la securite comme un bloc abstrait, mais comme une suite d'etapes a comprendre et a tester.

Concernant la coordination, j'ai compris l'importance de ramener les discussions vers des elements concrets. Lorsqu'un sujet semblait flou, il fallait revenir au code, aux branches, aux taches Trello ou aux resultats visibles. Cette experience m'a montre qu'une bonne communication projet ne se limite pas a parler en reunion : elle doit aussi produire des traces exploitables par les autres membres de l'equipe.

## 5. Competences acquises

Ce projet m'a permis de developper des competences techniques et transversales.

Sur le plan technique, j'ai progresse sur NestJS, TypeScript, l'organisation d'une API, les relations avec une base de donnees et les principes d'authentification avec JWT. Je ne dirais pas que je maitrise parfaitement tous ces sujets, mais je suis aujourd'hui plus capable de les reprendre avec methode, de savoir ou chercher, de lire une erreur et de comprendre comment avancer.

| Competence | Niveau avant le projet | Niveau apres le projet |
| --- | --- | --- |
| NestJS | Decouverte | Capable de reprendre un exemple et de l'adapter |
| TypeScript | Bases en progression | Plus a l'aise dans un projet structure |
| PostgreSQL / Prisma | Decouverte | Compréhension des modeles et relations principales |
| Authentification JWT / Guards | Decouverte | Capable d'expliquer le principe et de contribuer a l'implementation |
| Architecture backend | Theorique | Meilleure comprehension de l'organisation modulaire |
| Coordination technique | Peu experimente | Plus conscient des besoins de communication et de traces |

Sur le plan humain, le projet m'a fait progresser dans la communication. Etant plutot discret, j'ai du apprendre a exprimer davantage mes choix, mes doutes et mes besoins. J'ai aussi compris qu'une posture de referent ne signifie pas tout savoir, mais savoir chercher, demander, expliquer et rendre le travail plus lisible pour les autres.

## 6. Travail en equipe

Le travail en equipe a ete une dimension centrale du projet. Nous avons utilise Teams pour communiquer, Trello pour suivre les taches et GitHub pour versionner le code. Ces outils nous ont donne un cadre, mais ils ne suffisent pas a eux seuls a garantir une coordination efficace.

Une difficulte a ete de passer de l'organisation theorique a l'integration concrete. En sprint, chacun peut avancer sur une partie differente, mais le vrai test arrive lorsque les briques doivent fonctionner ensemble. C'est a ce moment que l'on voit si les routes correspondent aux besoins du front, si les modeles de donnees sont coherents et si les changements sont bien compris par tous.

La communication n'a pas toujours ete fluide. Certains sujets techniques auraient merite d'etre davantage expliques avant d'etre integres ou presentes comme acquis. Cela m'a appris a ne pas me baser uniquement sur ce qui est annonce oralement, mais a verifier les elements concrets : code disponible, branche a jour, PR lisible, fonctionnalite testable.

Un moment important du projet a ete l'assemblage des briques backend, base de donnees et interface. Ce n'etait pas seulement la livraison d'une fonctionnalite isolee, mais la prise de conscience que les choix de chacun avaient un impact sur le travail des autres. Cette etape m'a montre l'importance de mieux synchroniser les contributions, surtout lorsque les niveaux et les rythmes de travail sont differents.

## 7. Bilan personnel

Ce projet a ete exigeant, car il m'a place dans une situation ou je devais apprendre techniquement tout en prenant une place plus visible dans l'equipe. Je retiens surtout que le role de referent backend ne se limite pas a produire du code. Il demande aussi de rendre les choix comprehensibles, de garder une trace des decisions et de faciliter l'integration du travail collectif.

Je suis satisfait d'avoir progresse sur NestJS, TypeScript et les principes d'authentification. Je suis aussi conscient que certaines choses auraient pu etre mieux anticipees : la formalisation des decisions, la repartition des responsabilites, la verification reguliere de l'integration et la communication autour des changements importants.

Si je devais refaire ce projet, je mettrais en place plus tot :

- des regles claires de branches et de pull requests ;
- une documentation courte pour les decisions backend importantes ;
- des points d'integration reguliers, pas seulement des points d'avancement ;
- une verification plus concrete de ce qui est reellement termine ;
- une meilleure repartition entre mon travail de developpement et mon role de coordination.

Ma progression globale sur ce projet : 7/10.

Je justifie cette note par le fait que j'ai su prendre en main un role nouveau a mon niveau d'etudiant, progresser sur des sujets backend complexes et contribuer a la continuite du projet. Je garde une marge de progression importante sur la communication, l'anticipation et la formalisation des choix techniques.
