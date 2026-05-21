import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            role: string;
            organizationId: string;
        };
        token: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    refresh(body: {
        refreshToken: string;
    }): Promise<{
        token: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    verifyEmail(body: {
        token: string;
    }): Promise<{
        message: string;
    }>;
    enable2FA(): Promise<{
        qrCode: string;
    }>;
    verify2FA(body: {
        code: string;
    }): Promise<{
        success: boolean;
    }>;
    getMe(req: any): Promise<any>;
    getSessions(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        refreshToken: string;
        ipAddress: string | null;
        userAgent: string | null;
        expiresAt: Date;
    }[]>;
    deleteSession(id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        refreshToken: string;
        ipAddress: string | null;
        userAgent: string | null;
        expiresAt: Date;
    }>;
    revokeAllSessions(req: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
