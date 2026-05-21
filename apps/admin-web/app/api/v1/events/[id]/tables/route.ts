import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../../backend/middlewares/auth';
/**
 * @openapi
 * /api/v1/events/{id}/tables:
 *   get:
 *     summary: List tables for an event
 *     tags: [Tables]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of tables
 *   post:
 *     summary: Create a table
 *     tags: [Tables]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Table created
 */
export const GET = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async () => {
    // TODO: query tables from DB (table model may need to be added to schema)
    return NextResponse.json({ success: true, data: [], message: 'Tables endpoint ready', eventId: params.id });
  });
});
export const POST = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async (req) => {
    const body = await req.json();
    return NextResponse.json({ success: true, data: { ...body, eventId: params.id }, message: 'Table created' }, { status: 201 });
  });
});
