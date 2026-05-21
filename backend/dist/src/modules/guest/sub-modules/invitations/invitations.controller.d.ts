export declare class InvitationsController {
    send(id: string, body: {
        guestId: string;
    }): Promise<{
        success: boolean;
    }>;
    sendBulk(id: string, body: {
        guestIds: string[];
    }): Promise<{
        success: boolean;
    }>;
    findByCode(code: string): Promise<{
        code: string;
    }>;
}
