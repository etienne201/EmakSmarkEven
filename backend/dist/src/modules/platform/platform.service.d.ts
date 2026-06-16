import { PrismaService } from '../../database/prisma.service';
export declare class PlatformService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
    }[]>;
    updateSetting(key: string, value: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
    }>;
    getHealth(): Promise<{
        status: string;
        timestamp: Date;
    }>;
    findAllTemplates(): Promise<{
        id: string;
        organizationId: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        config: import("node_modules/@prisma/client/runtime/library").JsonValue;
        category: string;
        previewUrl: string;
        isPremium: boolean;
    }[]>;
    createTemplate(data: any): Promise<{
        id: string;
        organizationId: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        config: import("node_modules/@prisma/client/runtime/library").JsonValue;
        category: string;
        previewUrl: string;
        isPremium: boolean;
    }>;
    findAllWebhooks(orgId: string): Promise<{
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        events: import("node_modules/@prisma/client/runtime/library").JsonValue;
        secret: string;
        endpoint: string;
    }[]>;
    createWebhook(orgId: string, data: any): Promise<{
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        events: import("node_modules/@prisma/client/runtime/library").JsonValue;
        secret: string;
        endpoint: string;
    }>;
    findAllApiKeys(orgId: string): Promise<{
        id: string;
        organizationId: string;
        createdAt: Date;
        name: string;
        expiresAt: Date | null;
        keyHash: string;
        scopes: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        lastUsedAt: Date | null;
        revokedAt: Date | null;
    }[]>;
    createApiKey(orgId: string, name: string): Promise<{
        id: string;
        organizationId: string;
        createdAt: Date;
        name: string;
        expiresAt: Date | null;
        keyHash: string;
        scopes: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        lastUsedAt: Date | null;
        revokedAt: Date | null;
    }>;
    getAuditLogs(): Promise<{
        id: string;
        createdAt: Date;
        ipAddress: string | null;
        userAgent: string | null;
        userId: string | null;
        action: string;
        metadata: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        severity: string;
    }[]>;
}
