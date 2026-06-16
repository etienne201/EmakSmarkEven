"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../database/prisma.service");
const bcrypt = require("bcrypt");
const crypto_1 = require("crypto");
const auth_types_1 = require("./auth.types");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async login(email, password, ctx) {
        const resolvedEmail = (0, auth_types_1.resolveLoginEmail)(email);
        const user = await this.prisma.user.findUnique({
            where: { email: resolvedEmail },
            include: { role: true },
        });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (user.status !== 'active') {
            throw new common_1.UnauthorizedException('Account inactive');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role.name,
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = (0, crypto_1.randomUUID)();
        await this.prisma.userSession.create({
            data: {
                userId: user.id,
                refreshToken,
                ipAddress: ctx?.ip ?? null,
                userAgent: ctx?.userAgent ?? null,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        return {
            user: {
                uid: user.id,
                ownerId: user.organizationId,
                role: user.role.name,
                email: user.email,
                name: user.fullName,
            },
            accessToken,
            refreshToken,
        };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            return { success: true };
        const token = (0, crypto_1.randomUUID)();
        await this.prisma.passwordReset.create({
            data: {
                userId: user.id,
                token,
                expiresAt: new Date(Date.now() + 30 * 60 * 1000),
            },
        });
        return { success: true };
    }
    async resetPassword(dto) {
        const reset = await this.prisma.passwordReset.findUnique({
            where: { token: dto.token },
        });
        if (!reset)
            throw new common_1.BadRequestException('Invalid token');
        if (reset.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Token expired');
        }
        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({
            where: { id: reset.userId },
            data: { passwordHash: hashedPassword },
        });
        await this.prisma.passwordReset.delete({
            where: { token: dto.token },
        });
        return { success: true };
    }
    async getUserSessions(userId) {
        return this.prisma.userSession.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async deleteSession(sessionId) {
        return this.prisma.userSession.delete({
            where: { id: sessionId },
        });
    }
    async revokeAllSessions(userId) {
        return this.prisma.userSession.deleteMany({
            where: { userId },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map