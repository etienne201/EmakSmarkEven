import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../backend/lib/api-handler';
import { withAuth } from '../../../../backend/middlewares/auth';
import prisma from '../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/webhooks:
 *   get:
 *     summary: List webhooks
 *     tags: [Webhooks]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of webhooks
 *   post:
 *     summary: Create a webhook
 *     tags: [Webhooks]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Webhook created
 */
export const GET = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (_req, user) => {
    const hooks = await prisma.webhook.findMany({ where: { organizationId: user.organizationId! } });
    return NextResponse.json({ success: true, data: hooks });
  });
});
export const POST = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (req, user) => {
    const body = await req.json();
    const crypto = require('crypto');
    const hook = await prisma.webhook.create({ data: { organizationId: user.organizationId!, endpoint: body.endpoint, secret: crypto.randomBytes(32).toString('hex'), events: body.events || [] } });
    return NextResponse.json({ success: true, data: hook }, { status: 201 });
  });
});
