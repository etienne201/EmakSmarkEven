import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(email: string, password: string): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            role: string;
            organizationId: string;
        };
        token: string;
    }>;
    getUserSessions(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        refreshToken: string;
        ipAddress: string | null;
        userAgent: string | null;
        expiresAt: Date;
    }[]>;
    deleteSession(sessionId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        refreshToken: string;
        ipAddress: string | null;
        userAgent: string | null;
        expiresAt: Date;
    }>;
    revokeAllSessions(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
