import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../backend/middlewares/auth';
import prisma from '../../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/auth/sessions:
 *   get:
 *     summary: List active sessions for the current user
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of sessions
 */
export const GET = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (req, user) => {
    const sessions = await prisma.userSession.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, data: sessions });
  });
});
/**
 * @openapi
 * /api/v1/auth/sessions/revoke-all:
 *   delete:
 *     summary: Revoke all sessions for current user
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All sessions revoked
 */
export const DELETE = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (req, user) => {
    await prisma.userSession.deleteMany({ where: { userId: user.id } });
    return NextResponse.json({ success: true, message: 'All sessions revoked' });
  });
});
