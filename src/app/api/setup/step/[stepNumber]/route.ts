import { NextResponse } from "next/server";
import { SetupService } from "@backend/services/setup.service";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";
import { validateRequest } from "@backend/auth";

/**
 * @swagger
 * /api/setup/step/{stepNumber}:
 *   get:
 *     tags: ["Configuration & Setup"]
 *     summary: Récupérer les données d'une étape
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: stepNumber
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Données de l'étape }
 *   post:
 *     tags: ["Configuration & Setup"]
 *     summary: Sauvegarder les données d'une étape
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: stepNumber
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Données sauvegardées }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ stepNumber: string }> }
) {
  try {
    const payload = await validateRequest(request);
    const ownerId = payload?.ownerId || "default";
    const { stepNumber } = await params;
    const step = parseInt(stepNumber);

    const data = await SetupService.getStepData(String(ownerId), step);
    return createSuccessResponse(data, "STEP_DATA_FETCHED");
  } catch (error) {
    return handleApiError(error);
  }
}

import { 
  EventStep1Schema, 
  EventStep2Schema, 
  EventDesignSchema,
  EventSettingsSchema,
  EventRefinementSchema
} from "@backend/validations";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ stepNumber: string }> }
) {
  try {
    const payload = await validateRequest(request);
    const ownerId = payload?.ownerId || "default";
    const { stepNumber } = await params;
    const step = parseInt(stepNumber);
    const body = await request.json();

    // Validation dynamique selon l'étape
    let validatedData = body;
    if (step === 1) validatedData = EventStep1Schema.parse(body);
    if (step === 2) validatedData = EventStep2Schema.parse(body);
    if (step === 3) validatedData = EventDesignSchema.parse(body);
    if (step === 4) validatedData = EventSettingsSchema.parse(body);
    if (step === 5) validatedData = EventRefinementSchema.parse(body);

    const result = await SetupService.saveStepData(String(ownerId), step, validatedData);
    return createSuccessResponse(result, "STEP_DATA_SAVED");
  } catch (error) {
    return handleApiError(error);
  }
}
