export declare class AuthService {
    static login(email: string, passwordHash: string): Promise<{
        user: any;
        token: any;
    }>;
}
