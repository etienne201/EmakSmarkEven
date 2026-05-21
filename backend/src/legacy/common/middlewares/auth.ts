import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { UnauthorizedError } from '../lib/errors';

export async function getSession(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  let token: string | undefined;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    // Alternatively check cookies
    token = req.cookies.get('token')?.value;
  }

  if (!token) {
    throw new UnauthorizedError('Authentication token missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string };
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true, organization: true }
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedError('User account is not active');
    }

    return user;
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

export async function withAuth(req: NextRequest, handler: (req: NextRequest, user: any) => Promise<any>) {
  const user = await getSession(req);
  return handler(req, user);
}
