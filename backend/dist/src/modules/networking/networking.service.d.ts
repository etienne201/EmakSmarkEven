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
        title: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        eventId: string;
        isGroup: boolean;
    })[]>;
    createConnection(eventId: string, guestIds: string[]): Promise<{
        id: string;
        title: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        eventId: string;
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
        title: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        eventId: string;
        isGroup: boolean;
    })[]>;
    getChatHistory(conversationId: string): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        conversationId: string;
        senderGuestId: string | null;
        attachments: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    sendMessage(conversationId: string, senderGuestId: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        conversationId: string;
        senderGuestId: string | null;
        attachments: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
