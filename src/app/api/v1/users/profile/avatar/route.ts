import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../../backend/middlewares/auth';
import prisma from '../../../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/users/profile/avatar:
 *   put:
 *     summary: Update user avatar
 *     tags: [Users]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Avatar updated
 */
export const PUT = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (req, user) => {
    const body = await req.json();
    const updated = await prisma.user.update({ where: { id: user.id }, data: { avatarUrl: body.avatarUrl } });
    return NextResponse.json({ success: true, data: updated });
  });
});
