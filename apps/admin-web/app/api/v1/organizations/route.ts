import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../backend/lib/api-handler';
import { withAuth } from '../../../../backend/middlewares/auth';
import prisma from '../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/organizations:
 *   get:
 *     summary: List organizations for current user
 *     tags: [Organizations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of organizations
 *   post:
 *     summary: Create a new organization
 *     tags: [Organizations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Organization created
 */
export const GET = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (req, user) => {
    const orgs = await prisma.organization.findMany({ where: { OR: [{ ownerId: user.id }, { users: { some: { id: user.id } } }] } });
    return NextResponse.json({ success: true, data: orgs });
  });
});
export const POST = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (req, user) => {
    const body = await req.json();
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const org = await prisma.organization.create({ data: { name: body.name, slug, ownerId: user.id } });
    return NextResponse.json({ success: true, data: org }, { status: 201 });
  });
});
