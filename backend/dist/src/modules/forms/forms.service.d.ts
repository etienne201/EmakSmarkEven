import { PrismaService } from '../../database/prisma.service';
export declare class FormsService {
    private prisma;
    constructor(prisma: PrismaService);
    createForm(eventId: string, data: any): Promise<{
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        name: string;
        eventId: string;
        schema: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    getForms(eventId: string): Promise<{
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        name: string;
        eventId: string;
        schema: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }[]>;
    getFormById(id: string): Promise<{
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        name: string;
        eventId: string;
        schema: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    updateForm(id: string, data: any): Promise<{
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        name: string;
        eventId: string;
        schema: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    deleteForm(id: string): Promise<{
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        settings: import("@prisma/client/runtime/library").JsonValue | null;
        name: string;
        eventId: string;
        schema: import("@prisma/client/runtime/library").JsonValue;
        isActive: boolean;
    }>;
    getSubmissions(formId: string): Promise<{
        id: string;
        guestId: string | null;
        formId: string;
        answers: import("@prisma/client/runtime/library").JsonValue;
        submittedAt: Date;
    }[]>;
    createSubmission(formId: string, data: any): Promise<{
        id: string;
        guestId: string | null;
        formId: string;
        answers: import("@prisma/client/runtime/library").JsonValue;
        submittedAt: Date;
    }>;
}
