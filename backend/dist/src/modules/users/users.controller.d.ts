import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<({
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
        status: import("@prisma/client").$Enums.UserStatus;
        emailVerified: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    create(dto: CreateUserDto): Promise<{
        id: string;
        email: string;
        organizationId: string | null;
        roleId: string;
        passwordHash: string;
        fullName: string;
        avatarUrl: string | null;
        phone: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        emailVerified: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProfile(req: any): Promise<any>;
    updateProfile(req: any, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        organizationId: string | null;
        roleId: string;
        passwordHash: string;
        fullName: string;
        avatarUrl: string | null;
        phone: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        emailVerified: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateAvatar(req: any, body: {
        avatarUrl: string;
    }): Promise<{
        id: string;
        email: string;
        organizationId: string | null;
        roleId: string;
        passwordHash: string;
        fullName: string;
        avatarUrl: string | null;
        phone: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        emailVerified: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: string): Promise<{
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
        status: import("@prisma/client").$Enums.UserStatus;
        emailVerified: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        organizationId: string | null;
        roleId: string;
        passwordHash: string;
        fullName: string;
        avatarUrl: string | null;
        phone: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        emailVerified: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        email: string;
        organizationId: string | null;
        roleId: string;
        passwordHash: string;
        fullName: string;
        avatarUrl: string | null;
        phone: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        emailVerified: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
