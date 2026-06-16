import { PrismaService } from '../../database/prisma.service';
import { MailService } from '../mail/mail.service';
export declare class SuperAdminService {
    private prisma;
    private mailService;
    constructor(prisma: PrismaService, mailService: MailService);
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
        email: string;
        organizationId: string | null;
        roleId: string;
        passwordHash: string;
        fullName: string;
        avatarUrl: string | null;
        phone: string | null;
        status: import("node_modules/@prisma/client/default").$Enums.UserStatus;
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
        ipAddress: string | null;
        userAgent: string | null;
        userId: string | null;
        action: string;
        targetType: string | null;
        targetId: string | null;
        details: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        eventId: string | null;
    }[]>;
    createAdminAccount(data: {
        email: string;
        passwordHash: string;
        fullName: string;
        organizationName: string;
        organizationSlug: string;
    }): Promise<{
        emailSent: boolean;
        emailSimulated: boolean;
        owner: {
            id: string;
            email: string;
            organizationId: string | null;
            roleId: string;
            passwordHash: string;
            fullName: string;
            avatarUrl: string | null;
            phone: string | null;
            status: import("node_modules/@prisma/client/default").$Enums.UserStatus;
            emailVerified: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
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
