import { PrismaService } from '../../database/prisma.service';
export declare class PlatformService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        id: string;
        key: string;
        value: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateSetting(key: string, value: string): Promise<{
        id: string;
        key: string;
        value: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getHealth(): Promise<{
        status: string;
        timestamp: Date;
    }>;
    findAllTemplates(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        organizationId: string | null;
        category: string;
        previewUrl: string;
        config: import("@prisma/client/runtime/library").JsonValue;
        isPremium: boolean;
    }[]>;
    createTemplate(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        organizationId: string | null;
        category: string;
        previewUrl: string;
        config: import("@prisma/client/runtime/library").JsonValue;
        isPremium: boolean;
    }>;
    findAllWebhooks(orgId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        endpoint: string;
        secret: string;
        events: import("@prisma/client/runtime/library").JsonValue;
        active: boolean;
    }[]>;
    createWebhook(orgId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        endpoint: string;
        secret: string;
        events: import("@prisma/client/runtime/library").JsonValue;
        active: boolean;
    }>;
    findAllApiKeys(orgId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        organizationId: string;
        keyHash: string;
        scopes: import("@prisma/client/runtime/library").JsonValue | null;
        lastUsedAt: Date | null;
        expiresAt: Date | null;
        revokedAt: Date | null;
    }[]>;
    createApiKey(orgId: string, name: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        organizationId: string;
        keyHash: string;
        scopes: import("@prisma/client/runtime/library").JsonValue | null;
        lastUsedAt: Date | null;
        expiresAt: Date | null;
        revokedAt: Date | null;
    }>;
    getAuditLogs(): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        severity: string;
        ipAddress: string | null;
        userAgent: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
}
