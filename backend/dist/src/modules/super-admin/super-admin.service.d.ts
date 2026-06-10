import { PrismaService } from '../../database/prisma.service';
export declare class SuperAdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getPlatformStats(): Promise<{
        totalOrganizations: number;
        totalUsers: number;
        totalEvents: number;
    }>;
    getAllAdmins(): Promise<({
        role: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            isSystem: boolean;
        };
        organization: {
            id: string;
            email: string | null;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            logoUrl: string | null;
            website: string | null;
            ownerId: string;
            isActive: boolean;
        };
    } & {
        id: string;
        organizationId: string | null;
        roleId: string;
        email: string;
        passwordHash: string;
        fullName: string;
        avatarUrl: string | null;
        phone: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        emailVerified: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    blockOrganization(id: string): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        logoUrl: string | null;
        website: string | null;
        ownerId: string;
        isActive: boolean;
    }>;
    getAllSystemLogs(): Promise<{
        id: string;
        createdAt: Date;
        eventId: string | null;
        userId: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        action: string;
        targetType: string | null;
        targetId: string | null;
        details: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    createAdminAccount(data: {
        email: string;
        passwordHash: string;
        fullName: string;
        organizationName: string;
        organizationSlug: string;
    }): Promise<{
        owner: {
            id: string;
            organizationId: string | null;
            roleId: string;
            email: string;
            passwordHash: string;
            fullName: string;
            avatarUrl: string | null;
            phone: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            emailVerified: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        logoUrl: string | null;
        website: string | null;
        ownerId: string;
        isActive: boolean;
    }>;
}
