# 🗄️ Architecture Base de Données — PostgreSQL

Le projet utilise une base de données **PostgreSQL 15+** avec une architecture multi-tenant stricte.

## 🔐 Isolation Multi-Tenant (RLS)
Nous utilisons la **Row Level Security (RLS)** native de PostgreSQL. 
Chaque requête est isolée par le `admin_id`. 

### Comment l'utiliser dans le code :
Avant chaque requête, le service doit définir l'ID de l'admin courant :
```sql
SET app.current_admin_id = 'uuid-de-l-admin';
```

## 📐 Schéma Global
Le schéma complet est disponible dans [src/backend/database/schema.sql](../src/backend/database/schema.sql).

### Tables Clés :
- **Nom de la base** : `EventSmartDb` (configuré dans `docker-compose.yml`)
- **Utilisateur par défaut** : `postgres`
- **`admins`** : Les organisateurs (chaque admin = 1 événement).
- **`events`** : Les détails de l'événement, liés à `event_design` et `event_settings`.
- **`guests`** : Les invités avec leur token JWT unique pour l'accès public.
- **`tables`** : Gestion du plan de salle avec trigger de validation de capacité.

## ⚡ Triggers & Logique DB
Nous avons déporté certaines logiques critiques en base de données pour plus de performance et de sécurité :
- `check_table_capacity` : Empêche d'assigner un invité si la table est pleine.
- `check_gallery_limit` : Limite à 6 photos par galerie.
- `set_updated_at` : Mise à jour automatique des timestamps.

## 📊 Vues Statistiques
Utilisez les vues suivantes pour vos tableaux de bord :
- `v_event_stats` : Statistiques temps réel d'un événement.
- `v_platform_stats` : Dashboard global pour le Super Admin.
- `v_seating_plan` : Plan de table formaté en JSON.

---
*Expertise Backend — Engineering Team*
