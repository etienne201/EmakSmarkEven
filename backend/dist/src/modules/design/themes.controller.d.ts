import { DesignService } from './design.service';
import { UpdateThemeDto } from './dto/update-theme.dto';
export declare class ThemesController {
    private readonly designService;
    constructor(designService: DesignService);
    findAll(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        eventId: string;
        version: number;
        templateId: string | null;
        tokens: import("node_modules/@prisma/client/runtime/library").JsonValue;
        canvas: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        customCss: string | null;
    }[]>;
    create(id: string, dto: UpdateThemeDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        eventId: string;
        version: number;
        templateId: string | null;
        tokens: import("node_modules/@prisma/client/runtime/library").JsonValue;
        canvas: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        customCss: string | null;
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        eventId: string;
        version: number;
        templateId: string | null;
        tokens: import("node_modules/@prisma/client/runtime/library").JsonValue;
        canvas: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        customCss: string | null;
    }>;
    update(id: string, dto: UpdateThemeDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        eventId: string;
        version: number;
        templateId: string | null;
        tokens: import("node_modules/@prisma/client/runtime/library").JsonValue;
        canvas: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        customCss: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        eventId: string;
        version: number;
        templateId: string | null;
        tokens: import("node_modules/@prisma/client/runtime/library").JsonValue;
        canvas: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        customCss: string | null;
    }>;
}
