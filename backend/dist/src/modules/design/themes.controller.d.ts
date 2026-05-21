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
        templateId: string | null;
        tokens: import("@prisma/client/runtime/library").JsonValue;
        canvas: import("@prisma/client/runtime/library").JsonValue | null;
        customCss: string | null;
        version: number;
    }[]>;
    create(id: string, dto: UpdateThemeDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        eventId: string;
        templateId: string | null;
        tokens: import("@prisma/client/runtime/library").JsonValue;
        canvas: import("@prisma/client/runtime/library").JsonValue | null;
        customCss: string | null;
        version: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        eventId: string;
        templateId: string | null;
        tokens: import("@prisma/client/runtime/library").JsonValue;
        canvas: import("@prisma/client/runtime/library").JsonValue | null;
        customCss: string | null;
        version: number;
    }>;
    update(id: string, dto: UpdateThemeDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        eventId: string;
        templateId: string | null;
        tokens: import("@prisma/client/runtime/library").JsonValue;
        canvas: import("@prisma/client/runtime/library").JsonValue | null;
        customCss: string | null;
        version: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        eventId: string;
        templateId: string | null;
        tokens: import("@prisma/client/runtime/library").JsonValue;
        canvas: import("@prisma/client/runtime/library").JsonValue | null;
        customCss: string | null;
        version: number;
    }>;
}
