import { NextResponse } from 'next/server';
import { apiHandler } from '@/backend/lib/api-handler';
import { withAuth } from '@/backend/middlewares/auth';

/**
 * @openapi
 * /api/v1/events/{id}/workflow:
 *   get:
 *     summary: Get event workflow status
 *     tags: [Event Workflow]
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
const getHandler = async (req: Request, { params }: { params: { id: string } }) => {
  return NextResponse.json({ success: true, data: { workflowStatus: 'draft' } });
};

export const GET = apiHandler(withAuth(getHandler));
