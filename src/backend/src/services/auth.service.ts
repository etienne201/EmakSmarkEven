import { createToken, validateRequest } from "@backend/auth";

export class AuthService {
  static async generateTokens(payload: any) {
    // Note: createToken handles internal expiration logic
    const accessToken = await createToken(payload);
    const refreshToken = await createToken({ ...payload, isRefresh: true });
    return { accessToken, refreshToken };
  }

  static async refreshTokens(refreshToken: string) {
    const payload = await validateRequest({ 
      headers: { get: (name: string) => name === 'authorization' ? `Bearer ${refreshToken}` : null }
    } as any);
    
    if (!payload) throw new Error("Invalid refresh token");
    return this.generateTokens(payload);
  }

  static async validateSession(request: Request) {
    return validateRequest(request);
  }
}
