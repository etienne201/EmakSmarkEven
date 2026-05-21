import { apiHandler } from '@/backend/lib/api-handler';
import { NextResponse } from 'next/server';

/**
 * @openapi
 * /api/v1/forms/{id}/respond:
 *   post:
 *     summary: Submit a response to a form
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
  return NextResponse.json({ success: true, data: { id: 'new-response-id', formId: params.id } }, { status: 201 });
};

export const POST = apiHandler(postHandler);
