import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../../backend/middlewares/auth';
import prisma from '../../../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/organizations/{id}/users:
 *   get:
 *     summary: List members of an organization
 *     tags: [Organizations]
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
 *         description: List of users
 *   post:
 *     summary: Add a user to an organization
 *     tags: [Organizations]
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
 *         description: User added
 */
export const GET = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async () => {
    const users = await prisma.user.findMany({ where: { organizationId: params.id }, include: { role: true } });
    return NextResponse.json({ success: true, data: users });
  });
});
export const POST = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async (req) => {
    const { userId } = await req.json();
    const user = await prisma.user.update({ where: { id: userId }, data: { organizationId: params.id } });
    return NextResponse.json({ success: true, data: user });
  });
});
