import { SuperAdminService } from './super-admin.service';
export declare class SuperAdminController {
    private superAdminService;
    constructor(superAdminService: SuperAdminService);
    getStats(): Promise<{
        totalOrganizations: number;
        totalUsers: number;
        totalEvents: number;
    }>;
    getAdmins(): Promise<({
        organization: {
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string | null;
            phone: string | null;
            logoUrl: string | null;
            website: string | null;
            ownerId: string;
            isActive: boolean;
        };
        role: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isSystem: boolean;
        };
    } & {
        id: string;
        organizationId: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        email: string;
        phone: string | null;
        roleId: string;
        passwordHash: string;
        avatarUrl: string | null;
        emailVerified: boolean;
        lastLoginAt: Date | null;
    })[]>;
    blockOrg(id: string): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string | null;
        phone: string | null;
        logoUrl: string | null;
        website: string | null;
        ownerId: string;
        isActive: boolean;
    }>;
    getLogs(): Promise<{
        id: string;
        createdAt: Date;
        eventId: string | null;
        userId: string | null;
        action: string;
        targetType: string | null;
        targetId: string | null;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
    }[]>;
    createAdmin(data: any): Promise<{
        owner: {
            id: string;
            organizationId: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
            fullName: string;
            email: string;
            phone: string | null;
            roleId: string;
            passwordHash: string;
            avatarUrl: string | null;
            emailVerified: boolean;
            lastLoginAt: Date | null;
        };
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string | null;
        phone: string | null;
        logoUrl: string | null;
        website: string | null;
        ownerId: string;
        isActive: boolean;
    }>;
}
