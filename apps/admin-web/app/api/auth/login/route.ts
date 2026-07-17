import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@frontend/lib/api-handler";
import { loginSchema } from "@backend/validations/auth.schema";
import { AuthService } from "@backend/services/auth.service";
import { ValidationError } from "@frontend/lib/errors";

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await req.json();

  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationError(
      "Validation Failed",
      parsed.error.flatten().fieldErrors
    );
  }

  const { email, password } = parsed.data;

  const result = await AuthService.login(email, password);

  const response = NextResponse.json({
    success: true,
    data: {
      user: result.user,
      accessToken: result.token,
    },
  });

  response.cookies.set({
    name: "token",
    value: result.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
});