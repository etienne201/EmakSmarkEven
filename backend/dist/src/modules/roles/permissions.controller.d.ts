import { RolesService } from './roles.service';
export declare class PermissionsController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        key: string;
        label: string;
        scope: import("@prisma/client").$Enums.PermissionScope;
    }[]>;
}
