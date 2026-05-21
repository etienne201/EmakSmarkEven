import { NextResponse } from "next/server";
import { AuthGuard } from "@backend/middleware/auth-guard";
import { handleApiError, AppError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";

/**
 * @swagger
 * /api/utils/upload:
 *   post:
 *     tags: ["Utilitaires & Système"]
 *     summary: Uploader un fichier (Logo, Background, etc.)
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file: { type: string, format: binary }
 *               type: { type: string, enum: [logo, background, gallery] }
 *     responses:
 *       200: { description: Fichier uploadé }
 */
import { prisma } from "@backend/prisma";

export async function POST(request: Request) {
  try {
    const payload = await AuthGuard.admin(request);
    
    // Simuler l'upload et sauvegarder dans Postgres
    const upload = await prisma.uploads.create({
      data: {
        adminId: payload.uid, // Firebase UID
        fileUrl: "https://storage.smartevent.com/uploads/sample.png",
        fileName: "sample.png",
        fileSize: 1024,
      }
    });

    return createSuccessResponse(upload, "UPLOAD_SUCCESS");
  } catch (error) {
    return handleApiError(error);
  }
}

