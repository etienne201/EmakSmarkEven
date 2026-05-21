import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../backend/middlewares/auth';
import prisma from '../../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/security/login-history:
 *   get:
 *     summary: Get login history for current user
 *     tags: [Security]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Login history
 */
export const GET = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (_req, user) => {
    const history = await prisma.userSession.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 50 });
    return NextResponse.json({ success: true, data: history });
  });
});
