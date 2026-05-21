import { NextResponse } from 'next/server';
import { apiHandler } from '@/backend/lib/api-handler';
import { withAuth } from '@/backend/middlewares/auth';

/**
 * @openapi
 * /api/v1/events/{id}/setup/step/{stepNumber}:
 *   post:
 *     summary: Update setup step for an event
 *     tags: [Event Setup]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: stepNumber
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Success
 */
const postHandler = async (req: Request, { params }: { params: { id: string; stepNumber: string } }) => {
  return NextResponse.json({ success: true, data: { message: `Step ${params.stepNumber} updated` } });
};

export const POST = apiHandler(withAuth(postHandler));
