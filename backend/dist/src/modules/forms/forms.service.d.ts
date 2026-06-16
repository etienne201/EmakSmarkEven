import { PrismaService } from '../../database/prisma.service';
export declare class FormsService {
    private prisma;
    constructor(prisma: PrismaService);
    createForm(eventId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        isActive: boolean;
        eventId: string;
        settings: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        schema: import("node_modules/@prisma/client/runtime/library").JsonValue;
    }>;
    getForms(eventId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        isActive: boolean;
        eventId: string;
        settings: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        schema: import("node_modules/@prisma/client/runtime/library").JsonValue;
    }[]>;
    getFormById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        isActive: boolean;
        eventId: string;
        settings: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        schema: import("node_modules/@prisma/client/runtime/library").JsonValue;
    }>;
    updateForm(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        isActive: boolean;
        eventId: string;
        settings: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        schema: import("node_modules/@prisma/client/runtime/library").JsonValue;
    }>;
    deleteForm(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        slug: string;
        isActive: boolean;
        eventId: string;
        settings: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        schema: import("node_modules/@prisma/client/runtime/library").JsonValue;
    }>;
    getSubmissions(formId: string): Promise<{
        id: string;
        guestId: string | null;
        formId: string;
        answers: import("node_modules/@prisma/client/runtime/library").JsonValue;
        submittedAt: Date;
    }[]>;
    createSubmission(formId: string, data: any): Promise<{
        id: string;
        guestId: string | null;
        formId: string;
        answers: import("node_modules/@prisma/client/runtime/library").JsonValue;
        submittedAt: Date;
    }>;
}
