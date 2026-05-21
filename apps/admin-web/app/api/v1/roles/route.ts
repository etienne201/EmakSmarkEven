import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../backend/lib/api-handler';
import { withAuth } from '../../../../backend/middlewares/auth';
import prisma from '../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/roles:
 *   get:
 *     summary: List all roles
 *     tags: [Roles]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of roles
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Role created
 */
export const GET = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async () => {
    const roles = await prisma.role.findMany({ include: { permissions: { include: { permission: true } } } });
    return NextResponse.json({ success: true, data: roles });
  });
});
export const POST = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (req) => {
    const body = await req.json();
    const role = await prisma.role.create({ data: { name: body.name, description: body.description } });
    if (body.permissionIds && body.permissionIds.length > 0) {
      await prisma.rolePermission.createMany({ data: body.permissionIds.map((pid: string) => ({ roleId: role.id, permissionId: pid })) });
    }
    return NextResponse.json({ success: true, data: role }, { status: 201 });
  });
});
