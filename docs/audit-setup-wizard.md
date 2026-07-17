# Audit & Rapport d'Écarts — Event Setup Wizard

> Phase 0 (obligatoire, **avant toute implémentation**) — livrables #1, #2, #3, #10 du cahier des charges.
> Réalisé par lecture intégrale du schéma Prisma, des contrôleurs backend et des routes API consommées par le frontend.
> Aucune ligne de code applicatif n'a été modifiée pour produire ce rapport.

---

## 0. Résumé exécutif

| # | Constat | Sévérité |
|---|---------|----------|
| A | **Trois couches en conflit** : backend NestJS (`backend/src/modules`), couche API Next.js (`apps/admin-web/app/api`), et ancien wizard monolithe (`app/setup/page.tsx`, 1187 lignes). Migration monorepo inachevée. | 🔴 Bloquant |
| B | Les endpoints **Setup du backend NestJS sont des stubs** : ils renvoient `{ success: true }` / `{ currentStep: 1 }` sans appeler le service ni Prisma. | 🔴 Bloquant |
| C | Les routes **Next.js `/api/setup/*` importent des modules inexistants** (`@backend/services/setup.service`, `@backend/middleware/*`, `@backend/validations`, `@backend/auth`) → ne compilent pas. | 🔴 Bloquant |
| D | Incohérence modèle de données : la couche Next.js requête `event.adminId` (**champ inexistant** dans le schéma — qui a `createdById` + `organizationId`). 12 routes utilisent `adminId`. | 🔴 Bloquant |
| E | Rôles seedés = `SUPER_ADMIN / ADMIN / MANAGER / VIEWER` (4). Le cahier des charges exige **6 rôles** (Super Admin, Org Owner, Event Admin, Event Manager, Staff, Guest). | 🟠 Majeur |
| F | Règles métier invités/staff partiellement non modélisables : **pas de type d'invité** (Individuel/Couple/Famille/Groupe), **pas de modèle Staff**, **pas d'entité QRCode** de premier niveau (multi-QR par invité impossible). | 🟠 Majeur |
| G | **Aucun pipeline CI** (`.github/workflows` absent). **Aucune infra de test frontend / E2E** (seul `backend` a Jest). | 🟠 Majeur |
| H | Le wizard frontend est aujourd'hui un **placeholder vide** (`return null`). L'ancien wizard committé (1187 lignes) est cassé (alias `@frontend/*`, `@backend/eventConfig`, stores manquants). | 🟠 Majeur |

**Bonne nouvelle** : le schéma Prisma `Event` est **excellemment aligné** avec le wizard (champs `setupCompleted`, `currentStep`, `status`, + modèles `EventModule`, `EventSettings`, `EventTheme`, `EventContent`). La fondation data est saine ; le problème est l'absence d'implémentation et la dette de migration.

---

## 1. Architecture découverte (les 3 couches)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. Backend NestJS — backend/src/modules/*  (152 routes HTTP)          │
│    • Propre, Swagger, JwtAuthGuard + RolesGuard, DTO class-validator  │
│    • Aligné sur le schéma Prisma (organizationId + createdById, RBAC)  │
│    • MAIS endpoints Setup = STUBS (aucune logique)                     │
│    • N'est PAS appelé par le frontend aujourd'hui                      │
├─────────────────────────────────────────────────────────────────────┤
│ 2. Couche API Next.js — apps/admin-web/app/api/**/route.ts (159 fich.)│
│    • C'est CE que le frontend appelle réellement (fetch '/api/...')   │
│    • Modèle hérité « single-admin » : ownerId / adminId               │
│    • Importe @backend/* (ancien monolithe) → modules ABSENTS          │
│    • Incompatible avec le schéma Prisma actuel (adminId n'existe pas)  │
├─────────────────────────────────────────────────────────────────────┤
│ 3. Ancien wizard monolithe — apps/admin-web/app/setup/page.tsx        │
│    • 1187 lignes committées, imports @frontend/* / @backend/* cassés  │
│    • Actuellement neutralisé en `return null` pour débloquer le build │
└─────────────────────────────────────────────────────────────────────┘
```

> ⚠️ **Décision d'architecture requise avant la Phase 1** (voir §7). Le cahier des charges impose : « le frontend doit consommer exclusivement les endpoints déjà présents et validés ». Or **aucune** des deux couches Setup n'est aujourd'hui fonctionnelle ni validée. Il faut donc d'abord **compléter** une couche existante (pas en créer une nouvelle), puis y brancher le frontend.

---

## 2. Audit du schéma Prisma

Fichier : `backend/src/database/prisma/schema.prisma` (1276 lignes, 1 seule source de vérité — identique à `prisma/schema.prisma`).

### 2.1 Modèles demandés — présence & rôle

| Modèle demandé | Présent | Détail / mapping wizard |
|----------------|:------:|--------------------------|
| `Event` | ✅ | `schema.prisma:283`. Contient `title, slug, description, eventType, visibility, language, timezone, startDate, endDate, location, city, country, status, setupCompleted, currentStep, metadata`. **Couvre Étapes 1 & 2 + état du wizard.** |
| `User` | ✅ | `:151`. `roleId` (obligatoire), `organizationId?`. |
| `Organization` | ✅ | `:117`. `ownerId` → relation `OrganizationOwner`. |
| `Guest` | ✅ | `:547`. **Voir écarts §2.3.** |
| `Staff` | ❌ | **Absent.** Staff = `Guest.guestRole = staff` ou `User`. Pas d'entité dédiée. |
| `Invitation` | ✅ | `:974`. `invitationCode` (unique), `guestId?`, `qrCodeUrl?`. 1 invité → N invitations ✅. |
| `QRCode` | ❌ | **Absent en tant qu'entité.** QR éparpillé : `Guest.qrCode` (string), `GuestTicket.code`, `Invitation.qrCodeUrl`, modèle `QRScan` (log de scans). |
| `Role` | ✅ | `:205`. RBAC générique `name`/`isSystem`. |
| `Permission` | ✅ | `:225`. `key`, `scope` (global/organization/event) — **bonne fondation**. |
| `EventSettings` | ✅ | `:428`. `rsvpEnabled, qrEnabled, checkinEnabled, networkingEnabled, livestreamEnabled, guestLimit, customRules`. **Couvre Étape 3 (contraintes modules).** |
| `EventModules` | ✅ | `EventModule` `:373`. `moduleKey, enabled, config(Json), version`, contrainte `@@unique([eventId, moduleKey])`. **Couvre Étape 3.** |

Modèles bonus utiles : `EventWorkflow` (`:400`, statut draft→review→approved→published), `EventTheme` (`:458`, tokens/canvas/customCss → **Étape 4 Design**), `EventContent` (`:490`), `EventPublish` (`:942`), `EventAnalytics` (`:727`).

### 2.2 Mapping Wizard ↔ Schéma (très bon alignement)

| Étape wizard | Stockage Prisma | Statut |
|---|---|---|
| 1 — Infos générales | `Event` (title, slug, description, eventType, language, visibility) | ✅ champs présents |
| 2 — Lieu & dates | `Event` (location, city, country, timezone, startDate, endDate) | ✅ champs présents |
| 3 — Modules | `EventModule` + `EventSettings` | ✅ modèles présents |
| 4 — Design/Branding | `EventTheme` (tokens, canvas, customCss) + `EventAsset` (logo/bannière) | ✅ modèles présents |
| 5 — Invités & accès | `Guest`, `Role`/`Permission`, (Staff ❌) | 🟠 partiel |
| 6 — Validation finale | `Event.status` + `EventWorkflow` | ✅ modèles présents |
| État global (`currentStep`, complétion) | `Event.currentStep`, `Event.setupCompleted` | ✅ |

### 2.3 Écarts schéma vs règles métier

**Gestion des invités**
- ❌ « Un invité peut appartenir à **plusieurs QR Codes** » → `Guest.qrCode` est **un seul `String?`** (`:562`). Impossible en l'état.
- ❌ « Un invité peut être **Individuel / Couple / Famille / Groupe** » → **aucun champ de type/groupe**. `GuestRole` (`attendee, vip, speaker, organizer, staff, exhibitor`, `:84`) décrit le *rôle*, pas la *composition*. Pas de relation « membres du groupe ».
- ✅ « un ou plusieurs liens d'invitation » → relation `Guest.invitations Invitation[]` OK (`:579`).

**Gestion du staff**
- ❌ Pas de modèle `Staff` avec **ID unique + QR interne unique + rôle dans l'événement**. Aujourd'hui non distinct des invités.
- 🟡 `GuestTicket.code` (unique) pourrait servir de QR unique, mais ce n'est pas conçu pour le staff.

**QR Codes**
- ❌ Pas d'entité `QRCode` permettant la relation N–N invité↔QR ni un cycle de vie propre (révocation, type interne staff vs externe invité).

---

## 3. Audit des endpoints

### 3.1 Endpoints Setup — backend NestJS (`events.controller.ts`)

| Endpoint | Ligne | État |
|---|---|---|
| `GET /events/:id/setup/status` | `:53` | 🔴 **Stub** — renvoie `{ currentStep: 1 }` en dur |
| `POST /events/:id/setup/step/:stepId` | `:59` | 🔴 **Stub** — renvoie `{ success: true }`, ne lit pas le body validé |
| `POST /events/:id/setup/finalize` | `:65` | 🔴 **Stub** |
| `GET/PUT /events/:id/settings` | `:72/:78` | 🔴 **Stub** (`{}` / `{ success: true }`) |
| `GET/PUT /events/:id/modules` | `:85/:91` | 🔴 **Stub** (`[]` / `{ success: true }`) |
| `*/workflow/*` (review/approve/publish/archive) | `:98–127` | 🔴 **Stubs** |
| `POST /events` (create) | `:29` | 🔴 `organizationId` & `createdById` **non injectés** depuis `req.user` (commentaire l. 30) → création impossible (champs requis) |

`events.service.ts` (53 lignes) : CRUD basique avec `data: any` (typage perdu, **aucune** validation), **aucune** méthode setup/settings/modules/workflow.

DTO Setup (`event-setup.dto.ts`) : `EventSetupStepDto = { metadata: any }` — **pas de schéma par étape**. `UpdateEventModulesDto.modules: string[]` ne couvre pas `enabled`/`config`.

### 3.2 Endpoints Setup — couche Next.js (consommée par le frontend)

| Route | Problème |
|---|---|
| `GET /api/setup/status` | importe `@backend/middleware/*`, `@backend/prisma` (**absents**) + requête `event.adminId` (**champ inexistant**) |
| `GET/POST /api/setup/step/[stepNumber]` | importe `@backend/services/setup.service` & `@backend/validations` (`EventStep1Schema`…`EventRefinementSchema`) — **absents** |
| `POST /api/setup/finalize` | mêmes imports manquants |

> Ces modules `@backend/*` n'existent **que** sous forme de stubs jetables **non commités** créés en session précédente (`git status` → `?? backend/src/services/`, `?? backend/src/middleware/`). Dans le dépôt commité, **ces routes ne compilent pas**.

### 3.3 Doublons / obsolètes / manquants

- 🔁 **Doublon de surface Setup** : `/events/:id/setup/*` (NestJS) **vs** `/api/setup/*` (Next.js). Deux modèles d'identité incompatibles (`organizationId+createdById` vs `ownerId/adminId`).
- 🗑️ **Obsolète** : 12 routes Next.js référencent `adminId` (modèle single-admin hérité) — incohérent avec le schéma multi-tenant.
- ➕ **Manquant fonctionnellement** : aucune logique réelle de persistance d'étape, d'autosave, de validation croisée des dates, ni de contraintes de modules (guests toujours actif, qrCheckin/tables ⇒ guests).
- 📊 Volumétrie : **152** routes NestJS, **159** fichiers `route.ts` Next.js (~85 handlers) — surface importante à rationaliser.

---

## 4. Audit rôles & permissions

`seed.ts` crée 4 rôles : `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `VIEWER`.
`RolesGuard` (`roles.guard.ts`) compare les noms de rôle **normalisés** (insensible casse/espaces/tirets) — robuste. `JwtStrategy.validate` charge `user.role` + `organization` → le guard fonctionne.

| Rôle attendu (cahier des charges) | Couverture actuelle | Écart |
|---|---|---|
| Super Admin | ✅ `SUPER_ADMIN` (toutes permissions) | aucun |
| Organisation Owner | 🟡 `Organization.ownerId` existe, mais **pas de rôle dédié** | créer rôle + permissions org-scope |
| Event Admin | ❌ | absent |
| Event Manager | 🟡 ≈ `MANAGER` (permissions event-scope) | renommer/aligner |
| Staff | ❌ | absent (ni rôle ni modèle) |
| Guest | ❌ (rôle de connexion) | absent |

Fondation correcte : `Permission.scope ∈ {global, organization, event}` + table `RolePermission`. Il « manque » surtout le **seed** des 6 rôles cibles et leurs matrices de permissions, **pas** le moteur RBAC.

---

## 5. CI / Tests / Qualité

- 🔴 **Aucun** `.github/workflows/` → pipeline à créer intégralement (lint, typecheck, tests, build front+back, sécurité).
- 🔴 Pas d'outil de test frontend (ni Jest/Vitest/RTL), pas d'E2E (ni Cypress/Playwright). Seul `backend/package.json` déclare Jest.
- 🟢 Dépendances wizard déjà présentes côté `admin-web` : `react-hook-form ^7.76`, `@hookform/resolvers ^5.2`, `zod ^4.4`, `framer-motion`, `lucide-react`. **`zustand` est ABSENT** → à ajouter.
- `package.json` racine : scripts `dev/build/lint` (turbo) ; **pas** de `test`/`typecheck`.

---

## 6. Tableau de synthèse des écarts

| ID | Écart | Impact wizard | Correctif proposé | Effort |
|----|-------|---------------|-------------------|--------|
| G1 | Endpoints Setup NestJS = stubs | Bloque tout | Implémenter `EventsService` (status/step/finalize/settings/modules/workflow) + transactions Prisma | M |
| G2 | Routes `/api/setup/*` imports cassés + `adminId` | Bloque le frontend actuel | **Décision archi** (§7) puis réécriture sur le bon modèle | M |
| G3 | Création event sans `organizationId/createdById` | Pas de création | Injecter depuis `req.user` (decorator `@CurrentUser`) | S |
| G4 | DTO Setup faibles (`metadata: any`) | Validation absente | 1 schéma Zod/DTO **par étape** + `zodResolver` côté front | M |
| G5 | 6 rôles non seedés | Permissions incomplètes | Étendre `seed.ts` (Org Owner, Event Admin, Event Manager, Staff, Guest) + matrices | S |
| G6 | Type d'invité (Indiv/Couple/Famille/Groupe) absent | Étape 5 incomplète | Migration : `enum GuestType` + champ + (option groupe parent/membres) | M |
| G7 | Modèle Staff + QR interne unique absent | Gestion staff | Migration : modèle `Staff` (id, qrCode unique, eventRole) | M |
| G8 | Entité QRCode (multi-QR) absente | Règle invités | Migration : modèle `QRCode` (N–N Guest) **ou** acter la limite | M |
| G9 | Aucun CI | Qualité non garantie | Workflow GitHub Actions (lint, typecheck, test, build, audit) | S |
| G10 | Pas de tests front/E2E + zustand manquant | Couverture 80% impossible | Ajouter Vitest/RTL + Playwright + `zustand` | L |
| G11 | Wizard front = placeholder vide | Pas d'UI | Implémenter les 6 étapes (Phase 1+) | L |

(Effort : S ≤ ½j, M ≈ 1–2j, L ≥ 3j.)

---

## 7. ⛔ Décision d'architecture requise (bloquant Phase 1)

Le cahier des charges interdit de créer de nouveaux endpoints et impose de consommer « les endpoints déjà présents et validés ». **Or aucune couche Setup n'est fonctionnelle.** Il faut choisir **quelle couche existante compléter** :

- **Option A — Backend NestJS canonique** (recommandé). On implémente la logique dans `EventsService`, le frontend appelle le NestJS (`/events/:id/setup/*`). Aligné schéma/RBAC, propre, testable. Coût : brancher le frontend sur l'API NestJS (base URL + auth JWT) au lieu des routes Next.
- **Option B — Couche Next.js `/api`**. On répare `/api/setup/*` (recrée `setup.service`, `validations`, middleware) sur le modèle `organizationId/createdById`. Moins de changements côté appels frontend, mais on consolide une couche héritée (`ownerId/adminId`) à dette élevée.

👉 **Recommandation : Option A.** Je complète des endpoints **existants** (je n'en crée pas de nouveaux) et je pointe le wizard dessus.

---

## 8. Plan d'implémentation proposé (après validation)

- **Phase 1 — Fondations data & rôles** : migrations Prisma (GuestType, Staff, QRCode si retenu), seed des 6 rôles + permissions (G5, G6, G7, G8).
- **Phase 2 — Backend Setup** : implémenter `EventsService` (status/step/finalize/settings/modules/workflow), `@CurrentUser`, DTO/validation par étape, transactions (G1, G3, G4).
- **Phase 3 — Frontend Wizard** : store `useSetupStore` (Zustand), 6 étapes RHF+Zod, `StepperHeader`, autosave debounce 1500 ms, prévisualisation design temps réel, redirection création→wizard→dashboard (G11).
- **Phase 4 — QA** : unitaires (validation/stores/composants), intégration (API/workflow), E2E (création/setup complet/partiel/permissions/publication), couverture ≥ 80 % (G10).
- **Phase 5 — CI GitHub Actions** : lint, typecheck, tests, build front+back, audit sécurité, blocage merge si échec (G9).
- **Phase 6 — Documentation** technique & fonctionnelle + rapport final des écarts résiduels.

---

## 9. Questions bloquantes pour validation

1. **Architecture (§7)** : Option A (NestJS canonique, recommandé) ou Option B (couche Next.js) ?
2. **Modèle de données (G6–G8)** : autorisez-vous des **migrations Prisma** (GuestType, Staff, QRCode) ? Sinon j'implémente le wizard sur le modèle actuel et je documente ces 3 règles comme limites connues.
3. **Périmètre de livraison** : faut-il tout livrer d'un bloc, ou par PR incrémentales (1 PR par phase, plus sûr et reviewable) ?
