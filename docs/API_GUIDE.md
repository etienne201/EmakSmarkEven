# ⚡ Guide API & Sécurité

La plateforme **Smart Event AI OS** expose une API REST complète documentée via Swagger.

## 📖 Accès à la Documentation
- **URL** : `http://localhost:3001/api-docs`
- **Génération** : Les specs sont générées dynamiquement depuis `src/backend/src/swagger.ts`.

## 🔐 Rôles & Permissions (RBAC)

| Rôle | Description | Accès API |
| :--- | :--- | :--- |
| **Super Admin** | Gestion plateforme | `/api/superadmin/*` |
| **Admin** | Organisateur d'événement | `/api/guests/*`, `/api/tables/*` |
| **Staff** | Hôtesse d'accueil | `/api/attendance/check-in` |
| **Guest** | Invité final | `/api/public/*` |

## 🔑 Authentification
L'API utilise des tokens **JWT Bearer**. 
1. Obtenez un token via `/api/auth/login`.
2. Cliquez sur le bouton **"Authorize"** dans Swagger.
3. Collez votre token (sans le préfixe Bearer).

## 🛡️ Validation
Toutes les données entrantes sont validées via **Zod**. Les schémas se trouvent dans `src/backend/src/validations/`.
