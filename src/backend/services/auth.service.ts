import prisma from '../lib/prisma';
import { UnauthorizedError } from '../lib/errors';
import jwt from 'jsonwebtoken';
// In a real application, you should hash passwords with bcrypt
// import bcrypt from 'bcrypt';

export class AuthService {
  static async login(email: string, passwordHash: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true, organization: true }
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // In a real app: const isMatch = await bcrypt.compare(passwordHash, user.passwordHash);
    const isMatch = passwordHash === user.passwordHash;
    
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedError('User account is not active');
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1d' }
    );

    // Create session
    await prisma.userSession.create({
      data: {
        userId: user.id,
        refreshToken: token, // Simplified for demonstration
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      }
    });

    return { user, token };
  }
}
