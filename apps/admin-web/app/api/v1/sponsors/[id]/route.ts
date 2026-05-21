import { apiHandler } from '@/backend/lib/api-handler';
import { withAuth } from '@/backend/middlewares/auth';
import { NextResponse } from 'next/server';

/**
 * @openapi
 * /api/v1/sponsors/{id}:
 *   put:
 *     summary: Update a sponsor
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
const putHandler = async (req: Request, { params }: { params: { id: string } }) => {
  return NextResponse.json({ success: true, data: { id: params.id } });
};

/**
 * @openapi
 * /api/v1/sponsors/{id}:
 *   delete:
 *     summary: Delete a sponsor
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
const deleteHandler = async (req: Request, { params }: { params: { id: string } }) => {
  return NextResponse.json({ success: true, data: { id: params.id } });
};

export const PUT = apiHandler(withAuth(putHandler));
export const DELETE = apiHandler(withAuth(deleteHandler));
