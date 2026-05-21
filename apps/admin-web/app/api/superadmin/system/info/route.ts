import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";

/**
 * @swagger
 * /api/superadmin/system/info:
 *   get:
 *     tags: [" Super Admin - Supervision"]
 *     summary: Informations système détaillées
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Informations système }
 */
export async function GET(request: Request) {
  try {
    await AuthGuard.superAdmin(request);
    return createSuccessResponse({
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      cpu: process.cpuUsage(),
      pid: process.pid
    }, "SYSTEM_INFO_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}
