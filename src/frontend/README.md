# 🎨 Frontend Architecture
Ce dossier regroupe les ressources liées à l'interface utilisateur et à l'expérience client.

## Principes de design
- **Atomic Design** : Séparation entre `ui` (atomes) et `modules` (organismes).
- **Hooks-First** : Toute la logique d'état complexe doit être dans `/hooks`.
- **Theme-Driven** : Utilisation stricte des tokens CSS et variables Tailwind.

## Dossiers clés
- `components/ui/` : Boutons, modales, badges réutilisables.
- `components/modules/` : Sections entières (Dashboard, Planning).
- `assets/` : Images, icônes, fontes.
