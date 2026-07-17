import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../../backend/lib/api-handler';
import { withAuth } from '../../../../../../backend/middlewares/auth';
import prisma from '../../../../../../backend/lib/prisma';

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
 *     summary: Synchronize tables for an event
 *     tags: [Tables]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Tables synchronized
 */
export const GET = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async () => {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      select: { metadata: true },
    });
    const metadata = (event?.metadata as Record<string, any>) || {};
    return NextResponse.json({ success: true, data: metadata.tables || [] });
  });
});

export const POST = apiHandler(async (req: NextRequest, params: { id: string }) => {
  return withAuth(req, async (req) => {
    const body = await req.json();
    const tables = body.tables || [];

    const event = await prisma.event.findUnique({
      where: { id: params.id },
      select: { metadata: true },
    });

    const currentMeta = (event?.metadata as Record<string, any>) || {};
    const updatedMeta = {
      ...currentMeta,
      tables,
    };

    const updated = await prisma.event.update({
      where: { id: params.id },
      data: { metadata: updatedMeta },
      select: { metadata: true },
    });

    const metadata = (updated?.metadata as Record<string, any>) || {};
    return NextResponse.json({ success: true, data: metadata.tables || [] }, { status: 201 });
  });
});

