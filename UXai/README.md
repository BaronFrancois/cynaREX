# UXai

Prototype local d'un outil no-code de conception UI pense pour le handoff vers un LLM.

## Lancer le prototype

Ouvrir directement `index.html` dans un navigateur moderne.

Option serveur local :

```bash
python -m http.server 8000
```

Puis ouvrir :

```txt
http://localhost:8000
```

## Contenu

- `PLAN.md` : vision produit, architecture et roadmap.
- `CDC.md` : cahier des charges fonctionnel Figma x UXai.
- `index.html` : structure du prototype.
- `styles.css` : UI skeuomorphe inspiree du travail commence dans slideAI.
- `app.js` : logique du prototype sans framework.

## Ce que montre le prototype

- Prompt global pour generer une premiere UI.
- Modes Design / Prototype / Build / Inspect.
- Pages, frames, assets et tokens.
- Calques hierarchiques.
- Selection de blocs.
- Prompt local sur l'element selectionne.
- Edition manuelle simplifiee : couleur, radius, shadow, blur, animation.
- Apercu par device : desktop, iPhone Dynamic Island, Galaxy, Pixel, iPad, Meta Quest 2D panel.
- Audits accessibilite, performance et securite.
- Export simulant les fichiers utiles au LLM final :
  - `uxai.project.json`
  - `CDC.md`
  - `UI_LOCK_CONTRACT.md`
  - `IMPLEMENTATION_GUIDE.md`
  - `SECURITY_NOTES.md`

## Intention technique

Le front final doit rester stable.

UXai doit produire un contrat visuel et fonctionnel. Le LLM final doit brancher la logique sans redesigner l'interface.
