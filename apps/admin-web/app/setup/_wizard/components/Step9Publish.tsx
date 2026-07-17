"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PartyPopper, Rocket, Loader2, ArrowLeft, AlertTriangle } from "lucide-react";
import { useSetupStore } from "../store";
import { setupApi } from "../api";
import type { SetupStatus } from "../types";

interface Props {
  onBack: () => void;
}

export function Step9Publish({ onBack }: Props) {
  const router = useRouter();
  const eventId = useSetupStore((s) => s.eventId);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * BUG-08 FIX: Vérification de l'état backend AVANT et APRÈS submitForReview.
   * L'ancienne implémentation enchaînait les deux appels sans vérification
   * intermédiaire : si submitForReview réussissait mais publish échouait,
   * l'événement restait bloqué en statut "review" avec un message d'erreur générique.
   */
  const publish = async () => {
    if (busy) return;
    if (!eventId) return;
    setBusy(true);
    setError(null);

    try {
      // Étape 1 : Vérifier que la configuration est finalisée
      const initialStatus = await setupApi.getStatus(eventId);
      const s = initialStatus as SetupStatus;

      if (!s.setupCompleted) {
        setError(
          "La configuration n\u2019est pas encore finalisée. Veuillez valider la revue (Étape 8) avant de publier."
        );
        return;
      }

      // Étape 2 : Si déjà publié, rediriger directement
      if (s.status === "published") {
        router.push("/home");
        return;
      }

      // Étape 3 : Statuts inattendus (ex: archived, completed)
      if (s.status !== "draft" && s.status !== "review") {
        setError(
          `Statut actuel non publié (statut : ${s.status}). Veuillez relancer la publication depuis la bonne étape.`
        );
        return;
      }

      // Étape 4 : Soumettre pour review (si pas encore en review)
      if (s.status !== "review") {
        await setupApi.submitForReview(eventId);

        // Vérifier que la transition vers "review" a bien eu lieu
        const afterReviewStatus = await setupApi.getStatus(eventId);
        if (afterReviewStatus.status !== "review") {
          setError(
            `La transition vers le statut de revue a échoué (statut actuel : ${afterReviewStatus.status}). Veuillez réessayer.`
          );
          return;
        }
      }

      // Étape 5 : Publier
      await setupApi.publish(eventId);

      // Étape 6 : Vérifier que la publication a bien eu lieu avant de rediriger
      const finalStatus = await setupApi.getStatus(eventId);
      if (finalStatus.status !== "published") {
        setError(
          `La publication semble avoir échoué (statut actuel : ${finalStatus.status}). Veuillez réessayer.`
        );
        return;
      }

      router.push("/home");
    } catch (e) {
      setError((e as { message?: string }).message ?? "Échec de la publication. Veuillez réessayer.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="es-wizard-step es-animate-in">
      <div
        className="es-finalize-hero"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}
      >
        <span
          className="es-finalize-badge"
          style={{ background: "var(--accentbg)", color: "var(--accent)", padding: "16px", borderRadius: "50%", marginBottom: "20px" }}
        >
          <PartyPopper className="w-10 h-10" />
        </span>

        <h2 className="es-h2" style={{ marginBottom: "12px" }}>Configuration validée</h2>
        <p className="es-subtle" style={{ maxWidth: "480px", marginBottom: "32px", fontSize: "14px" }}>
          Toutes les informations ont été vérifiées et votre flyer a été validé.
          Publiez votre événement dès maintenant pour envoyer vos invitations et ouvrir l&apos;enregistrement&nbsp;!
        </p>

        {error && (
          <div
            className="es-alert es-alert--danger"
            style={{ marginBottom: "20px", maxWidth: "480px", textAlign: "left" }}
          >
            <AlertTriangle className="w-4 h-4" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: "13px" }}>{error}</p>
          </div>
        )}

        <div className="es-finalize-actions" style={{ display: "flex", gap: "12px" }}>
          <button
            type="button"
            className="es-btn es-btn--secondary"
            onClick={onBack}
            disabled={busy}
          >
            <ArrowLeft className="w-4 h-4" /> Revenir
          </button>

          <button
            type="button"
            className="es-btn es-btn--primary"
            onClick={publish}
            disabled={busy}
            style={{ minWidth: "180px" }}
          >
            {busy ? (
              <>
                <Loader2 className="w-4 h-4 es-spin" />
                Publication en cours…
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" /> Publier l&apos;événement
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
