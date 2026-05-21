import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../backend/lib/api-handler';
import { withAuth } from '../../../../backend/middlewares/auth';
import prisma from '../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/templates:
 *   get:
 *     summary: List templates
 *     tags: [Templates]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of templates
 *   post:
 *     summary: Create a template
 *     tags: [Templates]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Template created
 */
export const GET = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async () => {
    const templates = await prisma.template.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, data: templates });
  });
});
export const POST = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (req, user) => {
    const body = await req.json();
    const tpl = await prisma.template.create({ data: { name: body.name, category: body.category, previewUrl: body.previewUrl, config: body.config || {}, organizationId: user.organizationId } });
    return NextResponse.json({ success: true, data: tpl }, { status: 201 });
  });
});
