import { PrismaService } from '../../database/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
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
    findOne(id: string): Promise<{
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
    }>;
    create(data: any): Promise<{
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
    }>;
    update(id: string, data: any): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
