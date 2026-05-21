import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../../backend/middlewares/auth';

/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
export const GET = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (req, user) => {
    return NextResponse.json({ success: true, data: user });
  });
});
