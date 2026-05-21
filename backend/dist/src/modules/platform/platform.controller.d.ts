import { PlatformService } from './platform.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
export declare class PlatformController {
    private readonly platformService;
    constructor(platformService: PlatformService);
    getSettings(): Promise<{
        id: string;
        key: string;
        value: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateSetting(dto: UpdateSettingDto): Promise<{
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
    findTemplates(): Promise<{
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
    createTemplate(dto: any): Promise<{
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
    findWebhooks(orgId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        endpoint: string;
        secret: string;
        events: import("@prisma/client/runtime/library").JsonValue;
        active: boolean;
    }[]>;
    createWebhook(orgId: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        endpoint: string;
        secret: string;
        events: import("@prisma/client/runtime/library").JsonValue;
        active: boolean;
    }>;
    findApiKeys(orgId: string): Promise<{
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
    createApiKey(orgId: string, body: {
        name: string;
    }): Promise<{
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
    getLoginHistory(): Promise<{
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
