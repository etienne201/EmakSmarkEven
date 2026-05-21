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
    blockOrganization(id: string): Promise<{
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
    getAllSystemLogs(): Promise<{
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
