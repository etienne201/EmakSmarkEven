import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../backend/lib/api-handler';
import { withAuth } from '../../../../backend/middlewares/auth';
import prisma from '../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: List all users (admin)
 *     tags: [Users]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of users
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201:
 *         description: User created
 */
export const GET = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (_req, user) => {
    const orgFilter = user.role.name === 'superadmin' ? {} : { organizationId: user.organizationId };
    const users = await prisma.user.findMany({ where: orgFilter, include: { role: true }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, data: users });
  });
});
export const POST = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (req, user) => {
    const body = await req.json();
    const newUser = await prisma.user.create({ data: { email: body.email, passwordHash: body.password, fullName: body.fullName, roleId: body.roleId, organizationId: body.organizationId || user.organizationId } });
    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  });
});
