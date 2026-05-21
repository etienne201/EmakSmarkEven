import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ApiError } from './errors';

type HandlerFunction = (req: NextRequest, params?: any) => Promise<NextResponse | Response>;

export function apiHandler(handler: HandlerFunction) {
  return async (req: NextRequest, context: any) => {
    try {
      return await handler(req, context?.params);
    } catch (error: any) {
      console.error('API Error:', error);

      if (error instanceof ApiError) {
        return NextResponse.json(
          {
            error: error.message,
            ...(error.name === 'ValidationError' ? { details: (error as any).errors } : {}),
          },
          { status: error.statusCode }
        );
      }

      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Validation Error', details: error.errors },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}
