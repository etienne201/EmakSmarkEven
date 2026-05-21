import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../../backend/middlewares/auth';
import prisma from '../../../../../../backend/lib/prisma';

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user and invalidate session
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
export const POST = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (req, user) => {
    // Ideally we would extract the session token and delete it
    const token = req.cookies.get('token')?.value;
    if (token) {
      await prisma.userSession.deleteMany({
        where: { refreshToken: token }
      });
    }

    const response = NextResponse.json({ success: true, message: 'Logged out' });
    response.cookies.delete('token');
    
    return response;
  });
});
