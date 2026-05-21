import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../backend/lib/api-handler';
import prisma from '../../../../../backend/lib/prisma';
import { NotFoundError } from '../../../../../backend/lib/errors';
/**
 * @openapi
 * /api/v1/invitations/{code}:
 *   get:
 *     summary: Get invitation details by code
 *     tags: [Invitations]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Invitation data
 */
export const GET = apiHandler(async (req: NextRequest, params: { code: string }) => {
  const inv = await prisma.invitation.findUnique({ where: { invitationCode: params.code }, include: { guest: true, event: true } });
  if (!inv) throw new NotFoundError('Invitation not found');
  // Mark as viewed
  if (!inv.viewedAt) {
    await prisma.invitation.update({ where: { id: inv.id }, data: { viewedAt: new Date() } });
  }
  return NextResponse.json({ success: true, data: inv });
});
