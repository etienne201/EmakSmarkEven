import { createToken, validateRequest } from "@backend/auth";
import { prisma } from "@backend/prisma";
import { AppError } from "../middleware/error-handler";

export class AuthService {
  static async login(email: string, passwordHash: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true, organization: true }
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = passwordHash === user.passwordHash;
    
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    if (user.status !== 'active') {
      throw new AppError('User account is not active', 403);
    }

    const roleName = (user.role as any)?.name || 'admin';
    const payload = {
      uid: user.id,
      ownerId: user.id,
      role: roleName,
      email: user.email,
      name: user.fullName
    };

    const token = await createToken(payload);

    // Create session in database
    await prisma.userSession.create({
      data: {
        userId: user.id,
        refreshToken: token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day
      }
    });

    return { user: payload, token };
  }

  static async generateTokens(payload: any) {
    const accessToken = await createToken(payload);
    const refreshToken = await createToken({ ...payload, isRefresh: true });
    return { accessToken, refreshToken };
  }

  static async refreshTokens(refreshToken: string) {
    const payload = await validateRequest({ 
      headers: { get: (name: string) => name === 'authorization' ? `Bearer ${refreshToken}` : null }
    } as any);
    
    if (!payload) throw new AppError("Invalid refresh token", 401);
    return this.generateTokens(payload);
  }

  static async validateSession(request: Request) {
    return validateRequest(request);
  }
}
