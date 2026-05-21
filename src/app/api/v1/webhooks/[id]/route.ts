import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../backend/middlewares/auth';
import prisma from '../../../../../backend/lib/prisma';
import { NotFoundError } from '../../../../../backend/lib/errors';
/**
 * @openapi
 * /api/v1/webhooks/{id}:
 *   put:
 *     summary: Update a webhook
 *     tags: [Webhooks]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Webhook updated
 *   delete:
 *     summary: Delete a webhook
 *     tags: [Webhooks]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Webhook deleted
 */
export const PUT = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async (req) => {
    const body = await req.json();
    const hook = await prisma.webhook.update({ where: { id: params.id }, data: { endpoint: body.endpoint, events: body.events, active: body.active } });
    return NextResponse.json({ success: true, data: hook });
  });
});
export const DELETE = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async () => {
    await prisma.webhook.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  });
});
