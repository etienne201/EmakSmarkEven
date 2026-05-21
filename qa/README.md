# 🧪 Quality Assurance (QA) Suite
Bienvenue dans le centre de contrôle qualité du Smart Event AI OS.

## Outils utilisés
- **Playwright** : Automatisation des tests de bout en bout (E2E).
- **Jest** (Optionnel) : Tests unitaires de logique métier.

## Comment lancer les tests ?
1. Assurez-vous que le serveur API tourne sur le port 3001.
2. Lancez les tests E2E :
   ```bash
   npx playwright test -c qa/playwright.config.ts
   ```

## Structure
- `e2e/` : Tests de parcours utilisateurs critiques (Login, Check-in, RSVP).
- `unit/` : Tests de validation des services et calculs complexes.
