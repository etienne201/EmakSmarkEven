"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PartyPopper, Rocket, Loader2, ArrowLeft } from "lucide-react";
import { useSetupStore } from "../store";
import { setupApi } from "../api";

interface Props {
  onBack: () => void;
}

export function Step9Publish({ onBack }: Props) {
  const router = useRouter();
  const eventId = useSetupStore((s) => s.eventId);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publish = async () => {
    if (!eventId) return;
    setBusy(true);
    setError(null);
    try {
      await setupApi.submitForReview(eventId);
      await setupApi.publish(eventId);
      router.push("/home");
    } catch (e) {
      setError((e as { message?: string }).message ?? "Échec de la publication.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="es-wizard-step es-animate-in">
      <div className="es-finalize-hero" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
        <span className="es-finalize-badge" style={{ background: "var(--accentbg)", color: "var(--accent)", padding: "16px", borderRadius: "50%", marginBottom: "20px" }}>
          <PartyPopper className="w-10 h-10" />
        </span>
        
        <h2 className="es-h2" style={{ marginBottom: "12px" }}>Configuration validée</h2>
        <p className="es-subtle" style={{ maxWidth: "480px", marginBottom: "32px", fontSize: "14px" }}>
          Toutes les informations ont été vérifiées et votre flyer a été validé. 
          Publiez votre événement dès maintenant pour envoyer vos invitations et ouvrir l&apos;enregistrement !
        </p>

        {error && <p className="es-error-text" style={{ marginBottom: "16px" }}>{error}</p>}

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
            style={{ minWidth: "160px" }}
          >
            {busy ? (
              <Loader2 className="w-4 h-4 es-spin" />
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
