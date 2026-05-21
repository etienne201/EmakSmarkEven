import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../backend/lib/api-handler';
import { withAuth } from '../../../../backend/middlewares/auth';
import prisma from '../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/analytics:
 *   get:
 *     summary: List analytics summaries across events
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of analytics summaries
 */
export const GET = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (_req, user) => {
    const data = await prisma.eventAnalytics.findMany({ where: { organizationId: user.organizationId! }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, data });
  });
});
