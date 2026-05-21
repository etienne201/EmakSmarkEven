import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../backend/middlewares/auth';
import prisma from '../../../../../backend/lib/prisma';
import { NotFoundError } from '../../../../../backend/lib/errors';
/**
 * @openapi
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User data
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User updated
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted
 */
export const GET = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async () => {
    const u = await prisma.user.findUnique({ where: { id: params.id }, include: { role: true, organization: true } });
    if (!u) throw new NotFoundError('User not found');
    return NextResponse.json({ success: true, data: u });
  });
});
export const PUT = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async (req) => {
    const body = await req.json();
    const u = await prisma.user.update({ where: { id: params.id }, data: { fullName: body.fullName, phone: body.phone, status: body.status, roleId: body.roleId } });
    return NextResponse.json({ success: true, data: u });
  });
});
export const DELETE = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async () => {
    await prisma.user.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  });
});
