// Shared types for the Setup Wizard. These mirror the NestJS backend contracts
// (events.controller + event-setup.dto) so the frontend consumes them directly.

export type EventTypeKey =
  | "wedding"
  | "birthday"
  | "conference"
  | "festival"
  | "concert"
  | "expo"
  | "corporate"
  | "networking"
  | "church"
  | "gala"
  | "hybrid"
  | "vip"
  | "other";

export type VisibilityType = "public" | "private" | "vip";

export type EventStatus =
  | "draft"
  | "review"
  | "published"
  | "completed"
  | "archived";

export type ModuleKey =
  | "guests"
  | "invitations"
  | "qrCheckin"
  | "tables"
  | "seating"
  | "analytics"
  | "badges"
  | "notifications";

export type ModulesMap = Record<ModuleKey, boolean>;

export interface Step1Data {
  title: string;
  slug: string;
  description?: string;
  eventType: EventTypeKey;
  language?: string;
  visibility?: VisibilityType;
}

export interface Step2Data {
  location?: string;
  city?: string;
  country?: string;
  timezone?: string;
  startDate: string;
  endDate?: string;
}

export interface Step3Data {
  modules: ModulesMap;
}

export interface Step4Data {
  theme?: string;
  colors?: Record<string, string>;
  logoUrl?: string;
  bannerUrl?: string;
  typography?: Record<string, unknown>;
}

export interface Step5Data {
  guestCategories?: string[];
  staffCategories?: string[];
  permissions?: Record<string, unknown>;
  customAccess?: Record<string, unknown>;
}

// Shape returned by GET /events/:id/setup/status (already unwrapped from { data }).
export interface SetupStatus {
  eventId: string;
  currentStep: number;
  completedSteps: number[];
  setupCompleted: boolean;
  status: EventStatus;
  steps: {
    1: Partial<Step1Data> & { description?: string | null };
    2: Partial<Step2Data> & {
      startDate?: string | null;
      endDate?: string | null;
    };
    3: { modules: Partial<ModulesMap>; settings: unknown };
    4: { themes: unknown };
    5: { access: { guestCategories?: string[]; staffCategories?: string[] } | null };
  };
}

export interface ApiError {
  message: string;
  /** Field-level validation messages extracted from a 400 response, if any. */
  fieldMessages?: string[];
  status: number;
}
