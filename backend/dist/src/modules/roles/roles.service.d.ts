import { PrismaService } from '../../database/prisma.service';
export declare class RolesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        permissions: {
            roleId: string;
            permissionId: string;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isSystem: boolean;
    })[]>;
    findOne(id: string): Promise<{
        permissions: {
            roleId: string;
            permissionId: string;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isSystem: boolean;
    }>;
    create(data: any): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isSystem: boolean;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isSystem: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        isSystem: boolean;
    }>;
    findAllPermissions(): Promise<{
        id: string;
        createdAt: Date;
        key: string;
        label: string;
        scope: import("@prisma/client").$Enums.PermissionScope;
    }[]>;
}
