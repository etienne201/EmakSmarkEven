import {
  FileText,
  Boxes,
  LayoutTemplate,
  Palette,
  Edit,
  Users,
  CheckCircle2,
  Rocket,
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
    key: "base-info",
    title: "Infos de base",
    subtitle: "Titre, type, lieu et dates de l'événement",
    icon: FileText,
    required: true,
  },
  {
    id: 2,
    key: "modules",
    title: "Modules",
    subtitle: "Activez les fonctionnalités nécessaires",
    icon: Boxes,
    required: false,
  },
  {
    id: 3,
    key: "templates",
    title: "Templates",
    subtitle: "Choisissez un modèle de design",
    icon: LayoutTemplate,
    required: false,
  },
  {
    id: 4,
    key: "flyer-editor",
    title: "Éditeur de flyer",
    subtitle: "Créez et personnalisez votre flyer",
    icon: Edit,
    required: false,
  },
  {
    id: 5,
    key: "branding",
    title: "Design & flyer",
    subtitle: "Thème de marque, couleurs et logo",
    icon: Palette,
    required: false,
  },
  {
    id: 6,
    key: "content",
    title: "Contenu",
    subtitle: "Description et détails additionnels",
    icon: FileText,
    required: false,
  },
  {
    id: 7,
    key: "guests",
    title: "Invités",
    subtitle: "Catégories d'accès des invités",
    icon: Users,
    required: false,
  },
  {
    id: 8,
    key: "review",
    title: "Revue",
    subtitle: "Vérifiez vos configurations et le flyer",
    icon: CheckCircle2,
    required: false,
  },
  {
    id: 9,
    key: "publish",
    title: "Publication",
    subtitle: "Publiez votre événement",
    icon: Rocket,
    required: false,
  },
];

export const REQUIRED_STEPS = STEPS.filter((s) => s.required).map((s) => s.id);

