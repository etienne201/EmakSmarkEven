import { NextResponse } from "next/server";

export interface ApiResponse<T = any> {
  success: boolean;
  timestamp: string;
  code: string;
  data: T;
  message: string;
}

export function createSuccessResponse<T>(data: T, code: string = "SUCCESS", message: string = "Operation successful") {
  const response: ApiResponse<T> = {
    success: true,
    timestamp: new Date().toISOString(),
    code,
    data,
    message,
  };
  return NextResponse.json(response);
}

export function createErrorResponse(message: string, code: string = "ERROR", status: number = 400) {
  const response = {
    success: false,
    timestamp: new Date().toISOString(),
    code,
    data: null,
    message,
  };
  return NextResponse.json(response, { status });
}
