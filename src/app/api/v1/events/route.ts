import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../backend/lib/api-handler';
import { withAuth } from '../../../../backend/middlewares/auth';
import prisma from '../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/events:
 *   get:
 *     summary: List events
 *     tags: [Events]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of events
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Event created
 */
export const GET = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (_req, user) => {
    const where = user.role.name === 'superadmin' ? {} : { organizationId: user.organizationId };
    const events = await prisma.event.findMany({ where, orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, data: events });
  });
});
export const POST = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (req, user) => {
    const body = await req.json();
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const event = await prisma.event.create({ data: { ...body, slug, organizationId: user.organizationId!, createdById: user.id } });
    return NextResponse.json({ success: true, data: event }, { status: 201 });
  });
});
