import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { SetupWizardClient } from "./_wizard/SetupWizardClient";

export const dynamic = "force-dynamic";

export default function SetupPage() {
  return (
    <Suspense
      fallback={
        <div className="es-app es-wizard es-wizard-center">
          <Loader2 className="w-6 h-6 es-spin" aria-hidden />
        </div>
      }
    >
      <SetupWizardClient />
    </Suspense>
  );
}
