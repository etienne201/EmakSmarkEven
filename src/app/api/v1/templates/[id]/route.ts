import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../backend/middlewares/auth';
import prisma from '../../../../../backend/lib/prisma';
import { NotFoundError } from '../../../../../backend/lib/errors';
/**
 * @openapi
 * /api/v1/templates/{id}:
 *   get:
 *     summary: Get template by ID
 *     tags: [Templates]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Template data
 *   put:
 *     summary: Update template
 *     tags: [Templates]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Template updated
 *   delete:
 *     summary: Delete template
 *     tags: [Templates]
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
    const tpl = await prisma.template.findUnique({ where: { id: params.id } });
    if (!tpl) throw new NotFoundError('Template not found');
    return NextResponse.json({ success: true, data: tpl });
  });
});
export const PUT = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async (req) => {
    const body = await req.json();
    const tpl = await prisma.template.update({ where: { id: params.id }, data: { name: body.name, category: body.category, config: body.config } });
    return NextResponse.json({ success: true, data: tpl });
  });
});
export const DELETE = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async () => {
    await prisma.template.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  });
});
