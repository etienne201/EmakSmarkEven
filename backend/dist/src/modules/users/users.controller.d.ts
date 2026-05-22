import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<({
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
    create(dto: CreateUserDto): Promise<{
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
    }>;
    getProfile(req: any): Promise<any>;
    updateProfile(req: any, dto: UpdateUserDto): Promise<{
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
    }>;
    updateAvatar(req: any, body: {
        avatarUrl: string;
    }): Promise<{
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
    }>;
    findOne(id: string): Promise<{
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
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
