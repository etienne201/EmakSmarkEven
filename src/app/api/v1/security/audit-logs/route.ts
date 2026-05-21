import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../backend/middlewares/auth';
import prisma from '../../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/security/audit-logs:
 *   get:
 *     summary: List security audit logs
 *     tags: [Security]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Audit logs
 */
export const GET = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async () => {
    const logs = await prisma.securityAuditLog.findMany({ take: 100, orderBy: { createdAt: 'desc' }, include: { user: { select: { id: true, fullName: true, email: true } } } });
    return NextResponse.json({ success: true, data: logs });
  });
});
