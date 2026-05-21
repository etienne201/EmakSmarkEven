import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 400) {
    super(message);
  }
}

export function handleApiError(error: unknown) {
  // Always log full error for debugging
  console.error("API Error:", error instanceof Error ? error.message : error);
  if (error instanceof Error && error.stack) {
    console.error("Stack:", error.stack.split("\n").slice(0, 5).join("\n"));
  }

  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", details: error.issues },
      { status: 400 }
    );
  }

  // Prisma-specific errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Record not found. Complete previous setup steps first." },
        { status: 404 }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A record with this identifier already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: `Database error: ${error.code}` },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: "Internal Server Error" },
    { status: 500 }
  );
}
