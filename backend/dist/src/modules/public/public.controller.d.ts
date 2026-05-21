export declare class PublicController {
    findEvent(slug: string): Promise<{
        slug: string;
    }>;
    findSessions(slug: string): Promise<any[]>;
    findInvitation(code: string): Promise<{
        code: string;
    }>;
}
