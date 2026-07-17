import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { resolveLoginEmail } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string, ctx?: { ip?: string; userAgent?: string }) {
    const resolvedEmail = resolveLoginEmail(email);
    const user = await this.prisma.user.findUnique({
      where: { email: resolvedEmail },
      include: { role: true },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    if (user.status !== 'active') {
      throw new UnauthorizedException('Account inactive');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = randomUUID();

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

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) return { success: true };

    const token = randomUUID();

    await this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    return { success: true };
  }

  async resetPassword(dto: { token: string; newPassword: string }) {
    const reset = await this.prisma.passwordReset.findUnique({
      where: { token: dto.token },
    });

    if (!reset) throw new BadRequestException('Invalid token');

    if (reset.expiresAt < new Date()) {
      throw new BadRequestException('Token expired');
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

  async getUserSessions(userId: string) {
    return this.prisma.userSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteSession(sessionId: string) {
    return this.prisma.userSession.delete({
      where: { id: sessionId },
    });
  }

  async revokeAllSessions(userId: string) {
    return this.prisma.userSession.deleteMany({
      where: { userId },
    });
  }
}