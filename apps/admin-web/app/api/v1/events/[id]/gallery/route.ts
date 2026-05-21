import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../../backend/middlewares/auth';
import prisma from '../../../../../../backend/lib/prisma';
/**
 * @openapi
 * /api/v1/events/{id}/gallery:
 *   get:
 *     summary: Get event gallery
 *     tags: [Assets]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Gallery assets
 *   post:
 *     summary: Add asset to gallery
 *     tags: [Assets]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Added to gallery
 */
export const GET = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async () => {
    const assets = await prisma.eventAsset.findMany({ where: { eventId: params.id, assetType: 'gallery' } });
    return NextResponse.json({ success: true, data: assets });
  });
});
export const POST = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async (req, user) => {
    const body = await req.json();
    const asset = await prisma.eventAsset.create({ data: { eventId: params.id, uploadedById: user.id, assetType: 'gallery', url: body.url, fileName: body.fileName } });
    return NextResponse.json({ success: true, data: asset }, { status: 201 });
  });
});
