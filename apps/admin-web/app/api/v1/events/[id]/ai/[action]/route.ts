import { NextResponse } from 'next/server';
import { apiHandler } from '@/backend/lib/api-handler';
import { withAuth } from '@/backend/middlewares/auth';

/**
 * @openapi
 * /api/v1/events/{id}/ai/{action}:
 *   post:
 *     summary: Perform AI action
 *     tags: [Event AI]
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
 *           description: Action like generate-theme, generate-layout
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
const postHandler = async (req: Request, { params }: { params: { id: string; action: string } }) => {
  return NextResponse.json({ success: true, data: { message: `AI action ${params.action} completed` } });
};

export const POST = apiHandler(withAuth(postHandler));
