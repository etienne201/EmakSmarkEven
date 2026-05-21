# ⚙️ Configuration & Installation

## 🛠️ Pré-requis
- Node.js 18+
- Un compte Firebase (pour le stockage Cloud)
- Redis (optionnel, via RedisLabs ou Vercel KV)

## 📁 Variables d'Environnement (.env)
Copiez `.env.example` vers `.env` et remplissez les valeurs :

### Firebase
Nécessaire pour l'authentification et le stockage distant.
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
FIREBASE_PRIVATE_KEY=...
```

### Stockage (Fallback)
Si aucune variable Redis/KV n'est fournie, le système utilise automatiquement le stockage local dans `src/backend/data/storage_local/`.

## 🚀 Commandes de Développement
- `npm run dev:all` : Lance tous les services (User, API, Admin).
- `npm run dev:api` : Lance uniquement l'API (Port 3001).
- `npm run build` : Compilation pour la production.
