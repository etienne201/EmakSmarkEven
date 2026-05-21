import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../backend/middlewares/auth';
import prisma from '../../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/assets/upload:
 *   post:
 *     summary: Upload an asset
 *     tags: [Assets]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Asset uploaded
 */
export const POST = apiHandler(async (req: NextRequest) => {
  return withAuth(req, async (req, user) => {
    const body = await req.json();
    const asset = await prisma.eventAsset.create({ data: { uploadedById: user.id, assetType: body.assetType || 'other', url: body.url, fileName: body.fileName, mimeType: body.mimeType, sizeBytes: body.sizeBytes, eventId: body.eventId, organizationId: user.organizationId } });
    return NextResponse.json({ success: true, data: asset }, { status: 201 });
  });
});
