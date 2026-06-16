import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(email: string, password: string, ctx?: {
        ip?: string;
        userAgent?: string;
    }): Promise<{
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
    forgotPassword(email: string): Promise<{
        success: boolean;
    }>;
    resetPassword(dto: {
        token: string;
        newPassword: string;
    }): Promise<{
        success: boolean;
    }>;
    getUserSessions(userId: string): Promise<{
        id: string;
        createdAt: Date;
        refreshToken: string;
        ipAddress: string | null;
        userAgent: string | null;
        expiresAt: Date;
        userId: string;
    }[]>;
    deleteSession(sessionId: string): Promise<{
        id: string;
        createdAt: Date;
        refreshToken: string;
        ipAddress: string | null;
        userAgent: string | null;
        expiresAt: Date;
        userId: string;
    }>;
    revokeAllSessions(userId: string): Promise<import("node_modules/@prisma/client/default").Prisma.BatchPayload>;
}
