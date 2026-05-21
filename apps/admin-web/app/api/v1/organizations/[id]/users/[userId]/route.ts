import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../../../backend/middlewares/auth';
import prisma from '../../../../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/organizations/{id}/users/{userId}:
 *   put:
 *     summary: Update a user's role in the organization
 *     tags: [Organizations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User updated
 *   delete:
 *     summary: Remove a user from an organization
 *     tags: [Organizations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User removed
 */
export const PUT = apiHandler(async (req: NextRequest, params: { id: string; userId: string }) => {
  return withAuth(req, async (req) => {
    const { roleId } = await req.json();
    const user = await prisma.user.update({ where: { id: params.userId }, data: { roleId } });
    return NextResponse.json({ success: true, data: user });
  });
});
export const DELETE = apiHandler(async (req: NextRequest, params: { id: string; userId: string }) => {
  return withAuth(req, async () => {
    await prisma.user.update({ where: { id: params.userId }, data: { organizationId: null } });
    return NextResponse.json({ success: true, message: 'User removed from organization' });
  });
});
