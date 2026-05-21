import { NextResponse } from 'next/server';
import { apiHandler } from '@/backend/lib/api-handler';
import { withAuth } from '@/backend/middlewares/auth';

/**
 * @openapi
 * /api/v1/events/{id}/workflow/{action}:
 *   post:
 *     summary: Perform workflow action (review, approve, publish, archive)
 *     tags: [Event Workflow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum: [review, approve, publish, archive]
 *     responses:
 *       200:
 *         description: Success
 */
const postHandler = async (req: Request, { params }: { params: { id: string; action: string } }) => {
  return NextResponse.json({ success: true, data: { message: `Workflow action ${params.action} completed` } });
};

export const POST = apiHandler(withAuth(postHandler));
