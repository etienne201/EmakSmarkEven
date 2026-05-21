import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true, organization: true },
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Checking plain password hash for now as per legacy code
    if (user.passwordHash !== password) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('Compte inactif');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role.name,
        organizationId: user.organizationId,
      },
      token: this.jwtService.sign(payload),
    };
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
