import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        user: {
            uid: string;
            ownerId: string;
            role: string;
            email: string;
            name: string;
        };
        accessToken: string;
        refreshToken: `${string}-${string}-${string}-${string}-${string}`;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        success: boolean;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        success: boolean;
    }>;
    getSessions(req: any): Promise<{
        id: string;
        createdAt: Date;
        refreshToken: string;
        ipAddress: string | null;
        userAgent: string | null;
        expiresAt: Date;
        userId: string;
    }[]>;
    deleteSession(id: string): Promise<{
        id: string;
        createdAt: Date;
        refreshToken: string;
        ipAddress: string | null;
        userAgent: string | null;
        expiresAt: Date;
        userId: string;
    }>;
    revokeAll(req: any): Promise<import("node_modules/@prisma/client/default").Prisma.BatchPayload>;
}
