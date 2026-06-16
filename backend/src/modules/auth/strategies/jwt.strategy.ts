import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../database/prisma.service';
import { AuthUser } from '../auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string }): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
        organization: true,
      },
    });

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Session invalide ou compte inactif');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      organizationId: user.organizationId,
      role: user.role.name,
      permissions: user.role.permissions.map(
        (entry) => entry.permission.key,
      ),
      organization: user.organization,
    };
  }
}
