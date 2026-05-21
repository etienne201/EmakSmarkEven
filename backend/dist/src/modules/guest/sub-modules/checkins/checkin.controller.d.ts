export declare class CheckinController {
    checkin(body: {
        guestId: string;
    }): Promise<{
        success: boolean;
    }>;
    findAll(id: string): Promise<any[]>;
    live(): Promise<any[]>;
}
