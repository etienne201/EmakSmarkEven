# 🏗️ Architecture du Projet - Smart Event AI OS

Ce projet utilise une architecture **Modulaire Senior** basée sur Next.js 16+. Tout le code source est centralisé dans le dossier `src/` pour une propreté maximale.

## 📁 Structure des Dossiers

### 1. `src/app/`
Le point d'entrée de l'application. 
- `api/` : Les contrôleurs backend Next.js.
- `(pages)` : Les vues frontend.
- `api-docs/` : Interface Swagger UI.

### 2. `src/backend/src/`
Le cerveau du système, indépendant du framework.
- `services/` : Logique métier (Auth, Guests, Tables).
- `storage/` : Moteur de stockage hybride (Local/Cloud).
- `middleware/` : Guards de sécurité et gestion d'erreurs.
- `data/` : Stockage local persistant.

### 3. `src/frontend/src/`
La couche de présentation.
- `components/` : Composants UI réutilisables.
- `hooks/` : Logique React personnalisée.
- `context/` : Gestion d'état globale.

### 4. `qa/`
Tests de haute fiabilité.
- `e2e/` : Scénarios critiques (Check-in, Admin Flow) avec Playwright.

## 🛣️ Routage & Proxy
Le fichier `src/proxy.ts` agit comme une **Gateway**. Il redirige automatiquement le trafic vers les bons services (API sur 3001, Admin sur 3002) selon le `SERVICE_MODE` actif.

## 🔗 Alias de Chemins
Utilisez toujours les alias pour éviter les imports relatifs complexes :
- `@backend/*` ➔ `src/backend/src/*`
- `@frontend/*` ➔ `src/frontend/src/*`
- `@/*` ➔ `src/*`
