import { NextResponse } from "next/server";
import { apiHandler } from "@/backend/lib/api-handler";
import { withAuth } from "@/backend/middlewares/auth";

/**
 * @openapi
 * /api/v1/notifications/send:
 *   post:
 *     summary: POST /api/v1/notifications/send
 *     responses:
 *       200:
 *         description: Success
 */
export const POST = apiHandler(
  withAuth(async (req) => {
    return NextResponse.json({ message: "Success", data: {} });
  })
);
