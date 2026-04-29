# cynaREX / 0mewo

Dépôt regroupant les livrables et projets du workspace local **0mewo** (CYNA, Resume Matcher, API, vitrine, mobile, UX).

## Sécurité

- Les fichiers `.env`, `**/data/config.json` et `**/data/database.json` sont exclus via `.gitignore`.
- Ne commitez jamais de clés API. Copier les gabarits `.env.example` / `.env.sample`.
- Les PDF de CV personnels sous `/cv/*.pdf` ne sont pas versionnés.

## Structure (aperçu)

| Dossier | Description |
|--------|-------------|
| `cyna-api`, `cyna-vitrine` | Backend / frontend CYNA |
| `Cyna_mobile` | Application mobile |
| `cv/Resume-Matcher` | Fork / adaptation Resume Matcher |
| `backup/` | Copies de sauvegarde |
| `REX/`, `UXai/` | Documents et maquettes |
