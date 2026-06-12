// Small pure helpers shared across wizard steps.

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// <input type="datetime-local"> value -> ISO string for the backend.
export function localInputToIso(value?: string): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

export const EVENT_TYPE_LABELS: Record<string, string> = {
  wedding: "Mariage",
  birthday: "Anniversaire",
  conference: "Conférence",
  festival: "Festival",
  concert: "Concert",
  expo: "Exposition",
  corporate: "Entreprise",
  networking: "Networking",
  church: "Religieux",
  gala: "Gala",
  hybrid: "Hybride",
  vip: "VIP",
  other: "Autre",
};

export const VISIBILITY_LABELS: Record<string, string> = {
  public: "Public",
  private: "Privé",
  vip: "VIP",
};

export const MODULE_LABELS: Record<
  string,
  { label: string; description: string }
> = {
  guests: {
    label: "Invités",
    description: "Gestion de la liste des invités (toujours actif).",
  },
  invitations: {
    label: "Invitations",
    description: "Envoi de liens et invitations personnalisées.",
  },
  qrCheckin: {
    label: "Check-in QR",
    description: "Contrôle d'accès par QR code (nécessite les invités).",
  },
  tables: {
    label: "Tables",
    description: "Organisation par tables (nécessite les invités).",
  },
  seating: {
    label: "Plan de salle",
    description: "Plan de placement et sièges.",
  },
  analytics: {
    label: "Analyses",
    description: "Statistiques et tableaux de bord temps réel.",
  },
  badges: {
    label: "Badges",
    description: "Génération de badges pour les participants.",
  },
  notifications: {
    label: "Notifications",
    description: "Rappels et notifications automatiques.",
  },
};
