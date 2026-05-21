import { NextResponse } from 'next/server';
import { apiHandler } from '@/backend/lib/api-handler';
import { withAuth } from '@/backend/middlewares/auth';

/**
 * @openapi
 * /api/v1/events/{id}/setup/finalize:
 *   post:
 *     summary: Finalize event setup
 *     tags: [Event Setup]
 *     security:
 *       - bearerAuth: []
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
const postHandler = async (req: Request, { params }: { params: { id: string } }) => {
  return NextResponse.json({ success: true, data: { message: "Setup finalized" } });
};

export const POST = apiHandler(withAuth(postHandler));
