import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../../../backend/middlewares/auth';
/**
 * @openapi
 * /api/v1/events/{id}/guests/import:
 *   post:
 *     summary: Bulk import guests from CSV/JSON
 *     tags: [Guests]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Import result
 */
export const POST = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async (req) => {
    const body = await req.json();
    // TODO: Parse CSV/JSON, validate, bulk create
    return NextResponse.json({ success: true, message: 'Import completed', data: { imported: body.guests?.length || 0, eventId: params.id } });
  });
});
