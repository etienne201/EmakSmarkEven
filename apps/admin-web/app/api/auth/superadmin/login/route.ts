import { NextResponse } from "next/server";
import { AdminService } from "@backend/services/admin.service";
import { handleApiError } from "@backend/middleware/error-handler";
import { createSuccessResponse } from "@backend/middleware/response-handler";

/**
 * POST /api/auth/superadmin/login
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, totp } = body;

    // =========================
    // VALIDATION MINIMALE
    // =========================
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          code: "VALIDATION_ERROR",
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // =========================
    // SERVICE CALL
    // =========================
    const result = await AdminService.superAdminLogin(
      email,
      password,
      totp
    );

    // =========================
    // RESPONSE COOKIE SAFE
    // =========================
    const response = createSuccessResponse(
      {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
      "AUTH_SUCCESS",
      "Super Admin logged in successfully"
    );

    // ⚠️ sécurité: cookie httpOnly
    response.cookies.set({
      name: "access_token",
      value: result.accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    response.cookies.set({
      name: "refresh_token",
      value: result.refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}