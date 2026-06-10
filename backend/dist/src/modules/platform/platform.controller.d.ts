import { PlatformService } from './platform.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { CreateTemplateDto, CreateWebhookDto, CreateApiKeyDto } from './dto/platform.dto';
export declare class PlatformController {
    private readonly platformService;
    constructor(platformService: PlatformService);
    getSettings(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
    }[]>;
    updateSetting(dto: UpdateSettingDto): Promise<{
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
    findTemplates(): Promise<{
        id: string;
        organizationId: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        config: import("@prisma/client/runtime/library").JsonValue;
        category: string;
        previewUrl: string;
        isPremium: boolean;
    }[]>;
    createTemplate(dto: CreateTemplateDto): Promise<{
        id: string;
        organizationId: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        config: import("@prisma/client/runtime/library").JsonValue;
        category: string;
        previewUrl: string;
        isPremium: boolean;
    }>;
    findWebhooks(orgId: string): Promise<{
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        secret: string;
        events: import("@prisma/client/runtime/library").JsonValue;
        endpoint: string;
    }[]>;
    createWebhook(orgId: string, dto: CreateWebhookDto): Promise<{
        id: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        secret: string;
        events: import("@prisma/client/runtime/library").JsonValue;
        endpoint: string;
    }>;
    findApiKeys(orgId: string): Promise<{
        id: string;
        organizationId: string;
        createdAt: Date;
        name: string;
        expiresAt: Date | null;
        keyHash: string;
        scopes: import("@prisma/client/runtime/library").JsonValue | null;
        lastUsedAt: Date | null;
        revokedAt: Date | null;
    }[]>;
    createApiKey(orgId: string, body: CreateApiKeyDto): Promise<{
        id: string;
        organizationId: string;
        createdAt: Date;
        name: string;
        expiresAt: Date | null;
        keyHash: string;
        scopes: import("@prisma/client/runtime/library").JsonValue | null;
        lastUsedAt: Date | null;
        revokedAt: Date | null;
    }>;
    getAuditLogs(): Promise<{
        id: string;
        createdAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        action: string;
        severity: string;
    }[]>;
    getLoginHistory(): Promise<{
        id: string;
        createdAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        action: string;
        severity: string;
    }[]>;
}
