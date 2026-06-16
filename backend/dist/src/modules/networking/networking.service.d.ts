import { PrismaService } from '../../database/prisma.service';
export declare class NetworkingService {
    private prisma;
    constructor(prisma: PrismaService);
    getConnections(eventId: string): Promise<({
        participants: {
            guestId: string;
            joinedAt: Date;
            conversationId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        eventId: string;
        title: string | null;
        metadata: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        isGroup: boolean;
    })[]>;
    createConnection(eventId: string, guestIds: string[]): Promise<{
        id: string;
        createdAt: Date;
        eventId: string;
        title: string | null;
        metadata: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        isGroup: boolean;
    }>;
    getMatches(eventId: string, guestId: string): Promise<({
        participants: {
            guestId: string;
            joinedAt: Date;
            conversationId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        eventId: string;
        title: string | null;
        metadata: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        isGroup: boolean;
    })[]>;
    getChatHistory(conversationId: string): Promise<{
        id: string;
        createdAt: Date;
        attachments: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        content: string;
        conversationId: string;
        senderGuestId: string | null;
    }[]>;
    sendMessage(conversationId: string, senderGuestId: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        attachments: import("node_modules/@prisma/client/runtime/library").JsonValue | null;
        content: string;
        conversationId: string;
        senderGuestId: string | null;
    }>;
}
