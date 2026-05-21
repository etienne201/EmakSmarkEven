import { apiHandler } from '@/backend/lib/api-handler';
import { withAuth } from '@/backend/middlewares/auth';
import { NextResponse } from 'next/server';

/**
 * @openapi
 * /api/v1/forms/{id}/responses:
 *   get:
 *     summary: Get all responses for a form
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
const getHandler = async (req: Request, { params }: { params: { id: string } }) => {
  return NextResponse.json({ success: true, data: [] });
};

export const GET = apiHandler(withAuth(getHandler));
