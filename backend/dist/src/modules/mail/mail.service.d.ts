export declare class MailService {
    private readonly transporter;
    sendAdminInvitation(email: string, name: string, passwordDefault: string, eventId: string): Promise<{
        success: boolean;
        simulated: boolean;
        messageId?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        messageId: string;
        simulated?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        simulated?: undefined;
        messageId?: undefined;
    }>;
}
