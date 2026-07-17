import { create } from "zustand";
import type {
  ModulesMap,
  SetupStatus,
  Step1Data,
  Step2Data,
  Step4Data,
  Step5Data,
  EventStatus,
} from "./types";

export const TOTAL_STEPS = 9;

export const DEFAULT_MODULES: ModulesMap = {
  guests: true,
  invitations: false,
  qrCheckin: false,
  tables: false,
  seating: false,
  analytics: false,
  badges: false,
  notifications: false,
};

// Mirrors the backend applyModuleConstraints: guests always on; qrCheckin &
// tables require guests. Kept client-side so the UI reflects rules instantly.
export function applyModuleConstraints(m: ModulesMap): ModulesMap {
  const guests = true;
  return {
    ...m,
    guests,
    qrCheckin: guests && m.qrCheckin,
    tables: guests && m.tables,
  };
}

export interface StepData {
  step1: Partial<Step1Data>;
  step2: Partial<Step2Data>;
  step3: { modules: ModulesMap };
  step4: Partial<Step4Data>;
  step5: Partial<Step5Data>;
  step6: { description: string; agenda: string; extraText?: string };
  step7: { templateId?: string; designId?: string };
}

interface SetupState {
  eventId: string | null;
  currentStep: number;
  completedSteps: number[];
  setupCompleted: boolean;
  status: EventStatus | null;
  isSaving: boolean;
  saveError: string | null;
  lastSavedAt: number | null;
  data: StepData;

  setEventId: (id: string | null) => void;
  goToStep: (step: number) => void;
  hydrate: (status: SetupStatus) => void;
  updateStep1: (patch: Partial<Step1Data>) => void;
  updateStep2: (patch: Partial<Step2Data>) => void;
  updateModules: (patch: Partial<ModulesMap>) => void;
  updateStep4: (patch: Partial<Step4Data>) => void;
  updateStep5: (patch: Partial<Step5Data>) => void;
  updateStep6: (patch: Partial<{ description: string; agenda: string; extraText?: string }>) => void;
  updateStep7: (patch: Partial<{ templateId?: string; designId?: string }>) => void;
  markCompleted: (step: number) => void;
  setSaving: (saving: boolean) => void;
  setSaveError: (error: string | null) => void;
  setSaved: () => void;
  reset: () => void;
}

const emptyData: StepData = {
  step1: {},
  step2: {},
  step3: { modules: { ...DEFAULT_MODULES } },
  step4: {},
  step5: {},
  step6: { description: "", agenda: "", extraText: "" },
  step7: {},
};

export const useSetupStore = create<SetupState>((set) => ({
  eventId: null,
  currentStep: 1,
  completedSteps: [],
  setupCompleted: false,
  status: null,
  isSaving: false,
  saveError: null,
  lastSavedAt: null,
  data: emptyData,

  setEventId: (id) => set({ eventId: id }),
  goToStep: (step) =>
    set({ currentStep: Math.min(Math.max(step, 1), TOTAL_STEPS) }),

  hydrate: (status) =>
    set(() => {
      const s = status.steps;
      const modules = applyModuleConstraints({
        ...DEFAULT_MODULES,
        ...(s[3]?.modules ?? {}),
      } as ModulesMap);

      const theme = Array.isArray(s[4]?.themes) ? s[4].themes[0] : null;
      const themeTokens = (theme?.tokens ?? {}) as Record<string, unknown>;
      const themeColors = (themeTokens.colors ?? {}) as Record<string, string>;

      return {
        eventId: status.eventId,
        completedSteps: status.completedSteps ?? [],
        setupCompleted: status.setupCompleted,
        status: status.status,
        currentStep: Math.min(
          Math.max(status.currentStep || 1, 1),
          TOTAL_STEPS,
        ),
        data: {
          step1: {
            title: s[1]?.title ?? "",
            slug: s[1]?.slug ?? "",
            description: s[1]?.description ?? "",
            eventType: s[1]?.eventType,
            language: s[1]?.language ?? "fr",
            visibility: s[1]?.visibility ?? "private",
          },
          step2: {
            location: s[2]?.location ?? "",
            city: s[2]?.city ?? "",
            country: s[2]?.country ?? "",
            timezone: s[2]?.timezone ?? "",
            startDate: isoToLocalInput(s[2]?.startDate),
            endDate: isoToLocalInput(s[2]?.endDate),
          },
          step3: { modules },
          step4: {
            theme: theme?.name ?? "elegant-gold",
            colors: { primary: themeColors.primary ?? "#bfa14a" },
            logoUrl: (themeTokens.logoUrl as string) ?? "",
            bannerUrl: (themeTokens.bannerUrl as string) ?? "",
          },
          step5: {
            guestCategories: s[5]?.access?.guestCategories ?? [],
            staffCategories: s[5]?.access?.staffCategories ?? [],
          },
          step6: {
            description: s[1]?.description ?? "",
            agenda: (s[1] as { agenda?: string })?.agenda ?? "",
            extraText: (s[1] as { extraText?: string })?.extraText ?? "",
          },
          step7: {},
        },
      };
    }),

  updateStep1: (patch) =>
    set((st) => {
      const nextStep1 = { ...st.data.step1, ...patch };
      if ((patch.eventType === "concert" || patch.eventType === "festival") && (!nextStep1.visibility || nextStep1.visibility === "private")) {
        nextStep1.visibility = "public";
      }
      return { data: { ...st.data, step1: nextStep1 } };
    }),
  updateStep2: (patch) =>
    set((st) => ({ data: { ...st.data, step2: { ...st.data.step2, ...patch } } })),
  updateModules: (patch) =>
    set((st) => ({
      data: {
        ...st.data,
        step3: {
          modules: applyModuleConstraints({
            ...st.data.step3.modules,
            ...patch,
          }),
        },
      },
    })),
  updateStep4: (patch) =>
    set((st) => ({ data: { ...st.data, step4: { ...st.data.step4, ...patch } } })),
  updateStep5: (patch) =>
    set((st) => ({ data: { ...st.data, step5: { ...st.data.step5, ...patch } } })),
  updateStep6: (patch) =>
    set((st) => ({ data: { ...st.data, step6: { ...st.data.step6, ...patch } } })),
  updateStep7: (patch) =>
    set((st) => ({ data: { ...st.data, step7: { ...st.data.step7, ...patch } } })),

  markCompleted: (step) =>
    set((st) =>
      st.completedSteps.includes(step)
        ? {}
        : { completedSteps: [...st.completedSteps, step].sort((a, b) => a - b) },
    ),
  setSaving: (saving) => set({ isSaving: saving }),
  setSaveError: (error) => set({ saveError: error }),
  setSaved: () => set({ isSaving: false, saveError: null, lastSavedAt: Date.now() }),
  reset: () =>
    set({
      eventId: null,
      currentStep: 1,
      completedSteps: [],
      setupCompleted: false,
      status: null,
      isSaving: false,
      saveError: null,
      lastSavedAt: null,
      data: { ...emptyData, step3: { modules: { ...DEFAULT_MODULES } } },
    }),
}));

// Backend returns ISO datetimes; <input type="datetime-local"> needs
// "YYYY-MM-DDTHH:mm" in local time.
function isoToLocalInput(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}
