export declare class AIController {
    generateTheme(id: string, body: {
        prompt: string;
    }): Promise<{
        theme: {};
    }>;
    generateLayout(id: string, body: {
        prompt: string;
    }): Promise<{
        layout: {};
    }>;
    generateInvitation(id: string, body: {
        prompt: string;
    }): Promise<{
        invitation: {};
    }>;
    suggestColors(id: string, body: {
        theme: string;
    }): Promise<{
        colors: any[];
    }>;
}
