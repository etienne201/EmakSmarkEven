import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../../backend/middlewares/auth';
import prisma from '../../../../../../backend/lib/prisma';
import { NotFoundError } from '../../../../../../backend/lib/errors';
/**
 * @openapi
 * /api/v1/auth/sessions/{id}:
 *   delete:
 *     summary: Revoke a specific session
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session revoked
 */
export const DELETE = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async (req, user) => {
    const session = await prisma.userSession.findUnique({ where: { id: params.id } });
    if (!session || session.userId !== user.id) throw new NotFoundError('Session not found');
    await prisma.userSession.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: 'Session revoked' });
  });
});
