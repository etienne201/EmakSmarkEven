import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../../../backend/middlewares/auth';

/**
 * @openapi
 * /api/v1/auth/2fa/verify:
 *   post:
 *     summary: POST operation for /api/v1/auth/2fa/verify
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: Successful operation
 */
export const POST = apiHandler(withAuth(async (req: NextRequest) => {
  return NextResponse.json({ success: true, message: 'Mock response for POST /api/v1/auth/2fa/verify' });
}));
