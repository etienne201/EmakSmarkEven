import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../../../backend/middlewares/auth';
import prisma from '../../../../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/events/{id}/gallery/{assetId}:
 *   delete:
 *     summary: Remove asset from gallery
 *     tags: [Assets]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: assetId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Removed from gallery
 */
export const DELETE = apiHandler(async (req: NextRequest, params: { id: string; assetId: string }) => {
  return withAuth(req, async () => {
    await prisma.eventAsset.delete({ where: { id: params.assetId } });
    return new NextResponse(null, { status: 204 });
  });
});
