import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../database/prisma.service';
import { AuthUser } from '../auth.types';
import { PermissionsCacheService } from '../permissions-cache.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private permissionsCacheService: PermissionsCacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string }): Promise<AuthUser> {
    const cacheKey = `user:permissions:${payload.sub}`;
    const cachedUser = await this.permissionsCacheService.get(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

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

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      organizationId: user.organizationId,
      role: user.role.name,
      permissions: user.role.permissions.map(
        (entry) => entry.permission.key,
      ),
      accountType: user.accountType as any,
      organization: user.organization ? {
        id: user.organization.id,
        name: user.organization.name,
        slug: user.organization.slug,
        isActive: user.organization.isActive,
      } : null,
    };

    await this.permissionsCacheService.set(cacheKey, authUser, 300);

    return authUser;
  }
}
