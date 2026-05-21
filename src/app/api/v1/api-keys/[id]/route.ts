import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../backend/middlewares/auth';
import prisma from '../../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/api-keys/{id}:
 *   delete:
 *     summary: Revoke an API key
 *     tags: [API Keys]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: API key revoked
 */
export const DELETE = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async () => {
    await prisma.apiKey.update({ where: { id: params.id }, data: { revokedAt: new Date() } });
    return NextResponse.json({ success: true, message: 'API key revoked' });
  });
});
