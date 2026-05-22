import { SuperAdminService } from './super-admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
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
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            email: string | null;
            phone: string | null;
            logoUrl: string | null;
            website: string | null;
            ownerId: string;
            isActive: boolean;
        };
        role: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            isSystem: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        fullName: string;
        email: string;
        phone: string | null;
        avatarUrl: string | null;
        roleId: string;
        passwordHash: string;
        emailVerified: boolean;
        lastLoginAt: Date | null;
    })[]>;
    blockOrg(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
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
        userId: string | null;
        action: string;
        ipAddress: string | null;
        userAgent: string | null;
        eventId: string | null;
        targetType: string | null;
        targetId: string | null;
        details: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    createAdmin(dto: CreateAdminDto): Promise<{
        owner: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            fullName: string;
            email: string;
            phone: string | null;
            avatarUrl: string | null;
            roleId: string;
            passwordHash: string;
            emailVerified: boolean;
            lastLoginAt: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        email: string | null;
        phone: string | null;
        logoUrl: string | null;
        website: string | null;
        ownerId: string;
        isActive: boolean;
    }>;
}
