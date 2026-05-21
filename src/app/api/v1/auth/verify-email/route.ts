import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../backend/lib/api-handler';

/**
 * @openapi
 * /api/v1/auth/verify-email:
 *   post:
 *     summary: POST operation for /api/v1/auth/verify-email
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: Successful operation
 */
export const POST = apiHandler(async (req: NextRequest) => {
  return NextResponse.json({ success: true, message: 'Mock response for POST /api/v1/auth/verify-email' });
});
