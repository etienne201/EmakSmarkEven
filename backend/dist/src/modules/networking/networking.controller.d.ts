export declare class NetworkingController {
    findParticipants(id: string): Promise<any[]>;
    createConversation(body: {
        participantIds: string[];
    }): Promise<{
        id: string;
    }>;
    findConversation(id: string): Promise<{
        id: string;
    }>;
    sendMessage(id: string, body: {
        content: string;
    }): Promise<{
        success: boolean;
    }>;
}
