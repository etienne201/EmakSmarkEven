import { NextResponse } from "next/server";
import { apiHandler } from "@/backend/lib/api-handler";
import { withAuth } from "@/backend/middlewares/auth";

/**
 * @openapi
 * /api/v1/conversations/[id]/messages:
 *   post:
 *     summary: POST /api/v1/conversations/[id]/messages
 *     responses:
 *       200:
 *         description: Success
 */
export const POST = apiHandler(
  withAuth(async (req, { params }) => {
    return NextResponse.json({ message: "Success", data: {} });
  })
);
