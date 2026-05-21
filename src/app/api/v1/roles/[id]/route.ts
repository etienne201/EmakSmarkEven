import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../backend/middlewares/auth';
import prisma from '../../../../../backend/lib/prisma';
import { NotFoundError } from '../../../../../backend/lib/errors';
/**
 * @openapi
 * /api/v1/roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Roles]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Role data
 *   put:
 *     summary: Update role
 *     tags: [Roles]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Role updated
 *   delete:
 *     summary: Delete role
 *     tags: [Roles]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Role deleted
 */
export const GET = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async () => {
    const role = await prisma.role.findUnique({ where: { id: params.id }, include: { permissions: { include: { permission: true } } } });
    if (!role) throw new NotFoundError('Role not found');
    return NextResponse.json({ success: true, data: role });
  });
});
export const PUT = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async (req) => {
    const body = await req.json();
    const role = await prisma.role.update({ where: { id: params.id }, data: { name: body.name, description: body.description } });
    return NextResponse.json({ success: true, data: role });
  });
});
export const DELETE = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async () => {
    await prisma.role.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  });
});
