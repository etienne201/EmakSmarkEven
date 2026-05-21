import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../backend/middlewares/auth';
/**
 * @openapi
 * /api/v1/tables/{id}:
 *   put:
 *     summary: Update a table
 *     tags: [Tables]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Table updated
 *   delete:
 *     summary: Delete a table
 *     tags: [Tables]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Table deleted
 */
export const PUT = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async (req) => {
    const body = await req.json();
    return NextResponse.json({ success: true, data: { id: params.id, ...body } });
  });
});
export const DELETE = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async () => {
    return new NextResponse(null, { status: 204 });
  });
});
