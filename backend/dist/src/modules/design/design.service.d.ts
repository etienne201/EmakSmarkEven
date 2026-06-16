import { PrismaService } from '../../database/prisma.service';
export declare class DesignService {
    private prisma;
    constructor(prisma: PrismaService);
    findEventThemes(eventId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        eventId: string;
        version: number;
        templateId: string | null;
        tokens: import("node_modules/@prisma/client/runtime/library").JsonValue;
        canvas: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        customCss: string | null;
    }[]>;
    findOneTheme(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        eventId: string;
        version: number;
        templateId: string | null;
        tokens: import("node_modules/@prisma/client/runtime/library").JsonValue;
        canvas: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        customCss: string | null;
    }>;
    createEventTheme(eventId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        eventId: string;
        version: number;
        templateId: string | null;
        tokens: import("node_modules/@prisma/client/runtime/library").JsonValue;
        canvas: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        customCss: string | null;
    }>;
    updateEventTheme(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        eventId: string;
        version: number;
        templateId: string | null;
        tokens: import("node_modules/@prisma/client/runtime/library").JsonValue;
        canvas: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        customCss: string | null;
    }>;
    deleteEventTheme(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        eventId: string;
        version: number;
        templateId: string | null;
        tokens: import("node_modules/@prisma/client/runtime/library").JsonValue;
        canvas: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        customCss: string | null;
    }>;
    getEventDesign(eventId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        eventId: string;
        locale: string;
        blocks: import("node_modules/@prisma/client/runtime/library").JsonValue;
        variables: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
    }>;
    updateEventDesign(eventId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        eventId: string;
        locale: string;
        blocks: import("node_modules/@prisma/client/runtime/library").JsonValue;
        variables: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
    }>;
    getAssets(eventId: string): Promise<{
        id: string;
        organizationId: string | null;
        createdAt: Date;
        eventId: string | null;
        url: string;
        metadata: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        uploadedById: string;
        assetType: import("node_modules/@prisma/client/default").$Enums.AssetType;
        fileName: string;
        mimeType: string | null;
        sizeBytes: number | null;
    }[]>;
    createAsset(eventId: string, data: any): Promise<{
        id: string;
        organizationId: string | null;
        createdAt: Date;
        eventId: string | null;
        url: string;
        metadata: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        uploadedById: string;
        assetType: import("node_modules/@prisma/client/default").$Enums.AssetType;
        fileName: string;
        mimeType: string | null;
        sizeBytes: number | null;
    }>;
}
