import { NextResponse } from "next/server";
import { apiHandler } from "@/backend/lib/api-handler";
import { withAuth } from "@/backend/middlewares/auth";

/**
 * @openapi
 * /api/v1/conversations/[id]:
 *   get:
 *     summary: GET /api/v1/conversations/[id]
 *     responses:
 *       200:
 *         description: Success
 */
export const GET = apiHandler(
  withAuth(async (req, { params }) => {
    return NextResponse.json({ message: "Success", data: {} });
  })
);
