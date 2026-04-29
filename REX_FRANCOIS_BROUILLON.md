# REX - Retour d'Experience Projet CYNA

Nom : A COMPLETER  
Prenom : Francois  
Formation : CPI DEV  
Projet : Plateforme e-commerce CYNA  
Date : A COMPLETER

## 1. Presentation de mon role

Dans le cadre du projet CYNA, mon role a progressivement depasse celui d'un simple participant au developpement. J'ai ete implique sur la comprehension globale du projet, sur la partie technique, sur l'organisation de la demonstration et sur la mise en place d'une solution de secours lorsque le projet principal n'etait plus suffisamment stable pour etre presente correctement.

Le projet avait pour objectif de creer une plateforme e-commerce pour CYNA, une entreprise specialisee dans les services de cybersecurite. La solution devait permettre de presenter des offres de type SOC, EDR et XDR, de gerer un parcours utilisateur, un catalogue, un systeme de paiement, un support client et une partie administration.

Mon role principal a ete de contribuer a la mise en oeuvre technique et a la stabilisation du projet. J'ai du comprendre les differents elements de l'architecture : le front avec `cyna-vitrine`, l'API avec `cyna-api`, la partie mobile avec `Cyna_mobile`, ainsi que le dossier `backup` utilise pour securiser la demonstration. En pratique, j'ai aussi eu un role de coordination informelle, car j'ai du aider a faire le lien entre ce qui etait attendu dans le cadrage, ce qui avait ete developpe, et ce qui pouvait etre montre pendant la soutenance.

Ce role a evolue au fil du projet. Au depart, l'objectif etait de participer normalement a la construction de l'application. En fin de projet, la priorite est devenue beaucoup plus operationnelle : il fallait obtenir une version fonctionnelle, coherente avec le sujet, et suffisamment stable pour etre presentee devant le jury.

## 2. Travail realise

Mon travail a porte sur plusieurs aspects du projet.

Sur la partie technique, j'ai travaille autour de la comprehension et de l'utilisation des differents depots du projet. Le projet s'appuyait notamment sur une vitrine en Next.js, une API en NestJS, Prisma pour la gestion des donnees, Stripe pour le paiement, ainsi qu'une application mobile Expo. J'ai du comprendre comment ces briques etaient reliees, quelles fonctionnalites etaient operationnelles, lesquelles etaient partielles, et comment organiser une demonstration credible.

J'ai egalement participe a la preparation de la soutenance. Cette preparation ne s'est pas limitee aux slides : il fallait etre capable de presenter une application fonctionnelle. Trois jours avant l'oral, nous avons constate que le projet principal ne permettait pas de faire une demonstration fiable. J'ai donc prepare une solution de backup pour pouvoir heberger moi-meme le projet et garantir qu'une version soit visible et utilisable pendant la presentation.

Cette partie a represente un travail important, car il ne s'agissait pas simplement de lancer une application localement. Il fallait verifier les dependances, comprendre les variables d'environnement, identifier les parties qui pouvaient etre montrees sans erreur bloquante, et construire un parcours de demonstration coherent. L'objectif etait de montrer le maximum de valeur du projet sans masquer les limites existantes.

J'ai aussi contribue a la clarification documentaire du projet. Le document `CADRAGE-ALIGNEMENT.md` presente par exemple les liens entre les exigences du cadrage et l'implementation : plateforme mobile-first, identite visuelle, catalogue, categories SOC/EDR/XDR, chatbot, paiement, back-office, base de donnees et ecarts de stack. Ce type de travail est important, car il permet d'expliquer les decisions prises et les differences entre le cahier des charges initial et le resultat final.

Elements precis a completer :

- Mes commits principaux : A COMPLETER.
- Les pages ou modules que j'ai le plus modifies : A COMPLETER.
- Les fonctionnalites que j'ai personnellement developpees : A COMPLETER.
- Les actions exactes menees pour le backup : A COMPLETER.

## 3. Difficultes rencontrees

La difficulte la plus marquante du projet a ete l'instabilite du livrable principal a l'approche de la soutenance. Normalement, une demonstration doit etre preparee progressivement, avec une version stable disponible suffisamment tot. Dans notre cas, trois jours avant l'oral, le projet principal ne fonctionnait pas comme attendu. Cette situation a cree une pression importante, car la demonstration etait un moment central de la soutenance.

Cette difficulte etait a la fois technique et organisationnelle. D'un point de vue technique, il fallait comprendre pourquoi le projet n'etait pas exploitable pour la demo, quelles parties pouvaient etre recuperees, et comment construire une version presentable. D'un point de vue organisationnel, cela a montre que nous n'avions pas suffisamment anticipe la stabilisation finale du livrable.

Une autre difficulte a ete liee a l'heterogeneite des niveaux dans l'equipe. Jessica et Emmanuel avaient commence la programmation recemment. Leur participation a donc ete davantage orientee vers l'apprentissage, la comprehension, les tests ou l'accompagnement que vers une production technique complexe. Cette situation n'est pas negative en soi, mais elle demande une organisation adaptee. Il faut repartir les taches en fonction des niveaux, prevoir du temps pour expliquer, et eviter que toute la charge technique se concentre sur une seule personne en fin de projet.

J'ai egalement rencontre une difficulte autour de l'ecart entre le cadrage initial et l'implementation finale. Le cadrage mentionnait certaines technologies ou attentes, alors que le projet realise utilisait une stack differente : Next.js, NestJS, Prisma, Expo. Il a donc fallu etre capable de justifier ces choix ou ces ecarts, et de ne pas presenter le projet comme s'il avait suivi exactement le plan initial.

Enfin, la gestion du temps a ete un point difficile. La fin du projet a demande de faire des choix rapides : corriger, documenter, preparer la soutenance, construire une demo et accepter certaines limites. Cette situation m'a oblige a prioriser ce qui etait indispensable pour l'oral.

## 4. Solutions mises en place

Pour repondre au probleme de demonstration, j'ai mis en place une strategie de backup. L'objectif etait d'avoir une version fonctionnelle que je pouvais heberger et maitriser moi-meme, afin de reduire le risque de blocage pendant l'oral. Cette solution m'a permis de securiser la presentation et de montrer un parcours coherent, meme si tout le projet principal n'etait pas parfaitement stabilise.

J'ai aussi cherche a clarifier les fonctionnalites reellement disponibles. Plutot que de pretendre que tout etait termine, j'ai distingue ce qui fonctionnait, ce qui etait partiel, et ce qui devait encore etre ameliore. Cette approche m'a semble plus professionnelle, car elle permet de garder une presentation credible.

Face aux differences de niveau dans l'equipe, j'ai essaye d'adapter ma maniere de travailler. Avec des personnes qui debutent, il ne suffit pas de donner une tache complexe et d'attendre un resultat immediat. Il faut expliquer, montrer, decomposer les problemes, et accepter que l'apprentissage fasse partie du projet. Avec du recul, j'aurais voulu structurer cela plus tot, par exemple en prevoyant des taches plus progressives et mieux documentees.

Pour l'ecart entre cadrage et realisation, la solution a ete de documenter les differences. Le projet ne devait pas etre presente uniquement comme une execution parfaite du cahier des charges, mais comme une realisation avec des arbitrages techniques, des contraintes et des limites. Cette documentation est essentielle pour le DAT, car elle permet de relier le travail effectue aux criteres d'evaluation.

## 5. Competences acquises

Ce projet m'a permis de renforcer plusieurs competences techniques.

J'ai progresse sur la comprehension d'une architecture web complete, avec un front, une API, une base de donnees, des dependances, des variables d'environnement et un deploiement. J'ai egalement consolide ma comprehension de TypeScript, de Next.js, de NestJS et de Prisma. Meme si tous les elements n'ont pas ete finalises au meme niveau, le projet m'a oblige a comprendre comment les briques interagissent entre elles.

J'ai aussi developpe des competences liees au deploiement et a la preparation d'une demonstration. Avant ce projet, je voyais surtout le developpement comme la creation de fonctionnalites. Avec cette experience, j'ai compris qu'un projet n'a de valeur en soutenance ou en contexte professionnel que s'il peut etre lance, montre, explique et maintenu. Une fonctionnalite developpee mais impossible a demontrer perd beaucoup de sa valeur.

Sur le plan humain, j'ai progresse dans la gestion de la pression et dans l'adaptation. La preparation du backup m'a oblige a prendre des decisions rapidement, a identifier les priorites, et a accepter que tout ne puisse pas etre parfait. J'ai egalement mieux compris l'importance de travailler avec des profils differents. Le fait que Jessica et Emmanuel soient plus debutants m'a montre qu'une equipe projet ne fonctionne pas uniquement avec du code : elle fonctionne aussi avec de la communication, de la pedagogie et une repartition realiste des responsabilites.

Competences a completer avec niveau avant/apres :

| Competence | Niveau avant | Niveau apres |
| --- | --- | --- |
| Next.js / React | A COMPLETER | A COMPLETER |
| NestJS / API REST | A COMPLETER | A COMPLETER |
| Prisma / base de donnees | A COMPLETER | A COMPLETER |
| Deploiement / backup demo | A COMPLETER | A COMPLETER |
| Coordination projet | A COMPLETER | A COMPLETER |
| Gestion de crise | A COMPLETER | A COMPLETER |

## 6. Travail en equipe

Le travail en equipe a ete un aspect important du projet, mais aussi une source de difficultes. Le groupe n'avait pas un niveau homogene en developpement. Certaines personnes etaient plus autonomes techniquement, tandis que Jessica et Emmanuel etaient encore en phase d'apprentissage. Cela a influence la repartition des taches et la dynamique du projet.

Cette situation m'a fait comprendre qu'un projet de groupe ne peut pas etre gere uniquement en attribuant des fonctionnalites. Il faut aussi tenir compte du niveau de chacun, du temps disponible, de la capacite a comprendre une technologie, et du besoin d'accompagnement. Dans notre cas, une meilleure organisation aurait probablement permis de mieux valoriser la progression de chacun et d'eviter une concentration trop forte de la charge technique en fin de projet.

Malgre ces difficultes, le projet a permis a chacun de decouvrir des aspects concrets d'un projet informatique : organisation, code, documentation, presentation, demonstration et gestion des problemes. Pour moi, l'un des apprentissages principaux a ete de comprendre que la coordination doit commencer tres tot. Attendre la fin du projet pour verifier la stabilite du livrable cree un risque important.

Un point positif est que la situation de crise avant la soutenance nous a oblige a nous recentrer sur l'essentiel. Il fallait identifier ce qui pouvait etre montre, ce qui devait etre explique, et comment presenter le travail sans perdre en credibilite.

Elements a completer :

- Outils utilises pour l'organisation : A COMPLETER.
- Rituels SCRUM reels : A COMPLETER.
- Repartition exacte des roles : A COMPLETER.
- Moment fort de collaboration : A COMPLETER.

## 7. Bilan personnel

Ce projet a ete exigeant, surtout dans sa phase finale. Il m'a confronte a une situation que l'on peut retrouver dans un contexte professionnel : un livrable attendu, une date fixe, des problemes techniques, une equipe avec des niveaux differents et la necessite de presenter quelque chose de fonctionnel malgre tout.

Ce que je retiens le plus, c'est l'importance d'avoir une version stable tres tot. Developper des fonctionnalites est important, mais il faut regulierement verifier que l'application peut etre lancee, testee et montree. Si je devais recommencer, je mettrais en place plus tot un environnement de demonstration, une checklist de validation et des points reguliers de stabilisation.

Je retiens aussi que la documentation ne doit pas arriver uniquement a la fin. Le DAT demande de justifier les choix, de presenter les schemas, les tests, les limites et les perspectives. Si ces elements sont documentes au fur et a mesure, la fin du projet devient beaucoup plus simple.

Sur le plan personnel, je suis satisfait d'avoir reussi a reagir face au probleme de demo. Le backup n'etait pas la situation ideale, mais il a permis de ne pas arriver a la soutenance sans solution. Cette experience m'a appris a mieux gerer l'urgence, a prioriser, et a assumer les limites d'un projet tout en cherchant une solution concrete.

Ce que je ferais differemment :

- stabiliser une version de demo plus tot ;
- mieux repartir les responsabilites techniques ;
- prevoir davantage d'accompagnement pour les membres debutants ;
- documenter les choix techniques au fil de l'eau ;
- mettre en place des tests et validations regulieres ;
- anticiper les ecarts entre cadrage et implementation.

Ma progression globale sur ce projet : A COMPLETER / 10.  
Justification : A COMPLETER.

