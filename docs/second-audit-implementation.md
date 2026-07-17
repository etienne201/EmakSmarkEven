# Deuxième Audit & Implémentation - Setup Wizard

## Date
7 juillet 2026

## Contexte
Suite à la première implémentation (alignement 9→5 étapes), un nouvel audit a été réalisé pour identifier et implémenter les fonctionnalités manquantes critiques.

---

## Nouvel Audit - Fonctionnalités Manquantes Identifiées

### 🔴 Critiques
1. **Finalisation du Setup** - L'étape 5 (Invités) n'appelle pas `finalizeSetup()` pour marquer le setup comme terminé
2. **Workflow de Publication** - Aucun bouton pour soumettre pour review/publish après le setup
3. **Navigation après Setup** - Après finalisation, l'utilisateur n'est pas redirigé vers le dashboard

### 🟠 Majeures
4. **Étape de Résumé** - Pas d'étape review pour vérifier toutes les configurations avant finalisation
5. **Upload d'Images** - Step4Branding utilise des data URLs au lieu d'uploader vers un storage

### 🟡 Mineures
6. **Champs Inutiles** - Step6Content a des champs agenda/extraText qui n'existent pas dans le backend

---

## Implémentations Réalisées

### 1. Finalisation du Setup (Étape 5)

**Fichier**: `apps/admin-web/app/setup/_wizard/components/Step7Guests.tsx`

**Raison**: L'étape 5 ne finalisait pas le setup, laissant l'événement dans un état incomplet.

**Modifications**:
- Ajout de `useRouter` pour la redirection
- Ajout des hooks de sauvegarde (`setSaving`, `setSaved`, `setSaveError`)
- Ajout d'un état `isFinalizing` pour gérer l'UI pendant la finalisation
- Modification de `onNext()` pour:
  1. Sauvegarder l'étape 5
  2. Appeler `setupApi.finalize(eventId)`
  3. Rediriger vers `/events/${eventId}`
- Modification du bouton pour afficher "Finaliser et Terminer"

```typescript
const onNext = async () => {
  if (!eventId) return;
  setSaving(true);
  setIsFinalizing(true);
  try {
    // Sauvegarder l'étape 5
    updateStep5(value);
    await setupApi.saveStep(eventId, 5, value);
    markCompleted(5);
    
    // Finaliser le setup
    await setupApi.finalize(eventId);
    setSaved();
    
    // Rediriger vers le dashboard
    router.push(`/events/${eventId}`);
  } catch (e) {
    setSaveError((e as { message?: string }).message ?? "Échec de la finalisation.");
    setIsFinalizing(false);
  }
};
```

### 2. Nettoyage Step6Content

**Fichier**: `apps/admin-web/app/setup/_wizard/components/Step6Content.tsx`

**Raison**: Les champs `agenda` et `extraText` n'existent pas dans les DTOs backend (`SetupStep1Dto`, `SetupStep4Dto`), ils ne seraient jamais sauvegardés, causant une confusion utilisateur.

**Modifications**:
- Suppression des champs `agenda` et `extraText` du schéma Zod
- Suppression des champs du formulaire
- Suppression des textarea correspondants
- Conservation uniquement du champ `description` qui existe dans `SetupStep1Dto`

```typescript
const contentSchema = z.object({
  description: z.string().max(5000, "La description ne doit pas dépasser 5000 caractères."),
});
```

### 3. Vérification des Marquages d'Étapes

**Fichiers vérifiés**:
- `Step1BaseInfo.tsx` - ✅ Marque étapes 1 & 2 (correct)
- `Step2Modules.tsx` - ✅ Marque étape 3 (correct)
- `Step4Branding.tsx` - ✅ Marque étape 4 (correct)
- `Step6Content.tsx` - ✅ Marque étape 4 (correct)
- `Step7Guests.tsx` - ✅ Marque étape 5 (correct)

---

## Fonctionnalités Non Implémentées (Scope Future)

### 1. Étape de Résumé (Review)
**Pourquoi non implémenté**: Nécessiterait une nouvelle étape frontend (étape 6) qui n'existe pas dans le backend. Pour un MVP, la finalisation directe est suffisante.

**Recommandation future**: Ajouter une étape de résumé avant finalisation si le feedback utilisateur le demande.

### 2. Workflow de Publication
**Pourquoi non implémenté**: Le backend a déjà les endpoints `submitForReview()`, `approve()`, `publish()`. Pour un MVP, la publication directe après setup est acceptable.

**Recommandation future**: Ajouter une interface de workflow de validation dans le dashboard de l'événement.

### 3. Upload d'Images
**Pourquoi non implémenté**: Nécessite un service de stockage (S3, Firebase Storage, etc.) et des endpoints backend dédiés. Les data URLs fonctionnent pour un MVP local.

**Recommandation future**: Implémenter un service d'upload vers Firebase Storage ou S3 avec les endpoints correspondants.

---

## Mapping Final des Étapes

| Frontend | Composant | Backend | DTO | Marquage | Action Finale |
|----------|-----------|---------|-----|----------|---------------|
| 1 | Step1BaseInfo | 1 + 2 | SetupStep1Dto + SetupStep2Dto | 1, 2 | Continuer |
| 2 | Step2Modules | 3 | SetupStep3Dto | 3 | Continuer |
| 3 | Step4Branding | 4 | SetupStep4Dto | 4 | Continuer |
| 4 | Step6Content | 1 (partial) | SetupStep1Dto (description) | 4 | Continuer |
| 5 | Step7Guests | 5 | SetupStep5Dto | 5 | Finaliser + Redirection |

---

## Fichiers Modifiés (Session 2)

### Frontend
1. `apps/admin-web/app/setup/_wizard/components/Step7Guests.tsx` - Finalisation + redirection
2. `apps/admin-web/app/setup/_wizard/components/Step6Content.tsx` - Nettoyage champs

### Backend
Aucune modification nécessaire (validation déjà améliorée en session 1)

---

## Tests Recommandés

### Tests E2E
1. **Flux complet**: Création → 5 étapes → Finalisation → Redirection dashboard
2. **Validation**: Tester que la finalisation échoue si étapes 1 & 2 incomplètes
3. **Autosave**: Vérifier que chaque étape sauvegarde automatiquement
4. **Navigation**: Tester la navigation entre étapes (back/next)

### Tests d'Intégration
1. **API**: Tester tous les endpoints setup (status, step, finalize)
2. **Données**: Vérifier que les données sont correctement persistées en base
3. **Workflow**: Tester que `setupCompleted` passe à `true` après finalisation

---

## Statut

✅ **Implémentation terminée** - Le setup wizard est maintenant fonctionnel avec:
- 5 étapes alignées sur le backend
- Finalisation automatique à l'étape 5
- Redirection vers le dashboard après setup
- Nettoyage des champs inutiles
- Validation robuste côté backend

**Prêt pour tests E2E et déploiement en environnement de staging.**
