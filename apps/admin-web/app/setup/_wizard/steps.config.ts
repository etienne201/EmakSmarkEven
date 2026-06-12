import {
  FileText,
  MapPin,
  Boxes,
  Palette,
  Users,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

export interface StepMeta {
  id: number;
  key: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  required: boolean;
}

export const STEPS: StepMeta[] = [
  {
    id: 1,
    key: "general",
    title: "Informations générales",
    subtitle: "Titre, type et visibilité de l'événement",
    icon: FileText,
    required: true,
  },
  {
    id: 2,
    key: "location",
    title: "Lieu & dates",
    subtitle: "Où et quand se déroule l'événement",
    icon: MapPin,
    required: true,
  },
  {
    id: 3,
    key: "modules",
    title: "Modules & fonctionnalités",
    subtitle: "Activez ce dont vous avez besoin",
    icon: Boxes,
    required: false,
  },
  {
    id: 4,
    key: "branding",
    title: "Design & branding",
    subtitle: "Thème, couleurs et logo",
    icon: Palette,
    required: false,
  },
  {
    id: 5,
    key: "access",
    title: "Invités & accès",
    subtitle: "Catégories d'invités et de staff",
    icon: Users,
    required: false,
  },
  {
    id: 6,
    key: "review",
    title: "Validation finale",
    subtitle: "Vérifiez et publiez votre événement",
    icon: CheckCircle2,
    required: false,
  },
];

export const REQUIRED_STEPS = STEPS.filter((s) => s.required).map((s) => s.id);
