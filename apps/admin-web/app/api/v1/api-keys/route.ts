import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../backend/lib/api-handler';
import { withAuth } from '../../../../backend/middlewares/auth';
import prisma from '../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/api-keys:
 *   get:
 *     summary: List API keys
 *     tags: [API Keys]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of API keys
 *   post:
 *     summary: Create an API key
 *     tags: [API Keys]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201:
 *         description: API key created
 */
export const GET = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (_req, user) => {
    const keys = await prisma.apiKey.findMany({ where: { organizationId: user.organizationId! } });
    return NextResponse.json({ success: true, data: keys });
  });
});
export const POST = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (req, user) => {
    const body = await req.json();
    const crypto = require('crypto');
    const rawKey = crypto.randomBytes(32).toString('hex');
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const key = await prisma.apiKey.create({ data: { organizationId: user.organizationId!, name: body.name, keyHash, scopes: body.scopes || [], expiresAt: body.expiresAt ? new Date(body.expiresAt) : null } });
    return NextResponse.json({ success: true, data: { ...key, rawKey } }, { status: 201 });
  });
});
