# 🖥️ Backend Architecture
Ce dossier est destiné à isoler la logique métier pure du framework Next.js.

## Structure suggérée
- `services/` : Orchestration des données et règles métier.
- `models/` : Schémas Zod et types TypeScript.
- `storage/` : Adaptateurs de persistance (Redis, PostgreSQL, FS).
- `utils/` : Helpers transverses (date, crypto, validation).

> [!NOTE]
> Le code backend actuel réside dans `/lib`. Une migration progressive vers ce dossier est recommandée pour les projets de grande envergure.
