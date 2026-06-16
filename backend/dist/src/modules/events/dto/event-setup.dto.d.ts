import { EventTypeKey, VisibilityType } from '@prisma/client';
export declare class SetupStep1Dto {
    title: string;
    slug: string;
    description?: string;
    eventType: EventTypeKey;
    language?: string;
    visibility?: VisibilityType;
}
export declare class SetupStep2Dto {
    location?: string;
    city?: string;
    country?: string;
    timezone?: string;
    startDate: string;
    endDate?: string;
}
export declare class SetupModulesDto {
    guests?: boolean;
    invitations?: boolean;
    qrCheckin?: boolean;
    tables?: boolean;
    seating?: boolean;
    analytics?: boolean;
    badges?: boolean;
    notifications?: boolean;
}
export declare class SetupStep3Dto {
    modules: SetupModulesDto;
}
export declare class SetupStep4Dto {
    theme?: string;
    colors?: Record<string, string>;
    logoUrl?: string;
    bannerUrl?: string;
    typography?: Record<string, unknown>;
}
export declare class SetupStep5Dto {
    guestCategories?: string[];
    staffCategories?: string[];
    permissions?: Record<string, unknown>;
    customAccess?: Record<string, unknown>;
}
export declare class UpdateEventSettingsDto {
    rsvpEnabled?: boolean;
    qrEnabled?: boolean;
    checkinEnabled?: boolean;
    networkingEnabled?: boolean;
    livestreamEnabled?: boolean;
    guestLimit?: number;
    customRules?: Record<string, unknown>;
}
export declare class UpdateEventModulesDto {
    modules: SetupModulesDto;
}
export declare const SETUP_STEP_DTOS: {
    readonly 1: typeof SetupStep1Dto;
    readonly 2: typeof SetupStep2Dto;
    readonly 3: typeof SetupStep3Dto;
    readonly 4: typeof SetupStep4Dto;
    readonly 5: typeof SetupStep5Dto;
};
export type SetupStepNumber = keyof typeof SETUP_STEP_DTOS;
