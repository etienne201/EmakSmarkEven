import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../backend/lib/api-handler';
import { withAuth } from '../../../../backend/middlewares/auth';
import prisma from '../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/permissions:
 *   get:
 *     summary: List all permissions
 *     tags: [Roles]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of permissions
 */
export const GET = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async () => {
    const perms = await prisma.permission.findMany({ orderBy: { key: 'asc' } });
    return NextResponse.json({ success: true, data: perms });
  });
});
