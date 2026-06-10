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
        templateId: string | null;
        tokens: import("@prisma/client/runtime/library").JsonValue;
        canvas: import("@prisma/client/runtime/library").JsonValue | null;
        customCss: string | null;
        version: number;
    }[]>;
    findOneTheme(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        eventId: string;
        templateId: string | null;
        tokens: import("@prisma/client/runtime/library").JsonValue;
        canvas: import("@prisma/client/runtime/library").JsonValue | null;
        customCss: string | null;
        version: number;
    }>;
    createEventTheme(eventId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        eventId: string;
        templateId: string | null;
        tokens: import("@prisma/client/runtime/library").JsonValue;
        canvas: import("@prisma/client/runtime/library").JsonValue | null;
        customCss: string | null;
        version: number;
    }>;
    updateEventTheme(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        eventId: string;
        templateId: string | null;
        tokens: import("@prisma/client/runtime/library").JsonValue;
        canvas: import("@prisma/client/runtime/library").JsonValue | null;
        customCss: string | null;
        version: number;
    }>;
    deleteEventTheme(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        eventId: string;
        templateId: string | null;
        tokens: import("@prisma/client/runtime/library").JsonValue;
        canvas: import("@prisma/client/runtime/library").JsonValue | null;
        customCss: string | null;
        version: number;
    }>;
    getEventDesign(eventId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        eventId: string;
        locale: string;
        blocks: import("@prisma/client/runtime/library").JsonValue;
        variables: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    updateEventDesign(eventId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        eventId: string;
        locale: string;
        blocks: import("@prisma/client/runtime/library").JsonValue;
        variables: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getAssets(eventId: string): Promise<{
        id: string;
        organizationId: string | null;
        createdAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        eventId: string | null;
        url: string;
        uploadedById: string;
        assetType: import("@prisma/client").$Enums.AssetType;
        fileName: string;
        mimeType: string | null;
        sizeBytes: number | null;
    }[]>;
    createAsset(eventId: string, data: any): Promise<{
        id: string;
        organizationId: string | null;
        createdAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        eventId: string | null;
        url: string;
        uploadedById: string;
        assetType: import("@prisma/client").$Enums.AssetType;
        fileName: string;
        mimeType: string | null;
        sizeBytes: number | null;
    }>;
}
