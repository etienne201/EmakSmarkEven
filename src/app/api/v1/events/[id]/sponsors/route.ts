import { apiHandler } from '@/backend/lib/api-handler';
import { withAuth } from '@/backend/middlewares/auth';
import { NextResponse } from 'next/server';

/**
 * @openapi
 * /api/v1/events/{id}/sponsors:
 *   get:
 *     summary: Get sponsors for an event
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

/**
 * @openapi
 * /api/v1/events/{id}/sponsors:
 *   post:
 *     summary: Add a sponsor to an event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Created
 */
const postHandler = async (req: Request, { params }: { params: { id: string } }) => {
  return NextResponse.json({ success: true, data: { id: 'new-sponsor-id', eventId: params.id } }, { status: 201 });
};

export const GET = apiHandler(getHandler);
export const POST = apiHandler(withAuth(postHandler));
