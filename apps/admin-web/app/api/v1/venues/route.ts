import { apiHandler } from '@/backend/lib/api-handler';
import { withAuth } from '@/backend/middlewares/auth';
import { NextResponse } from 'next/server';

/**
 * @openapi
 * /api/v1/venues:
 *   get:
 *     summary: Get all venues
 *     responses:
 *       200:
 *         description: Success
 */
const getHandler = async (req: Request) => {
  return NextResponse.json({ success: true, data: [] });
};

/**
 * @openapi
 * /api/v1/venues:
 *   post:
 *     summary: Create a new venue
 *     responses:
 *       201:
 *         description: Created
 */
const postHandler = async (req: Request) => {
  return NextResponse.json({ success: true, data: { id: 'new-venue-id' } }, { status: 201 });
};

export const GET = apiHandler(getHandler);
export const POST = apiHandler(withAuth(postHandler));
