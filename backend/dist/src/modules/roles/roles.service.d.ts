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
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isSystem: boolean;
    })[]>;
    findOne(id: string): Promise<{
        permissions: {
            roleId: string;
            permissionId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isSystem: boolean;
    }>;
    create(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isSystem: boolean;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isSystem: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isSystem: boolean;
    }>;
    findAllPermissions(): Promise<{
        id: string;
        createdAt: Date;
        key: string;
        label: string;
        scope: import("node_modules/@prisma/client/default").$Enums.PermissionScope;
    }[]>;
}
