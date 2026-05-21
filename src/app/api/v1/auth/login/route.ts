import { NextRequest, NextResponse } from 'next/server';
import { apiHandler } from '../../../../../backend/lib/api-handler';
import { loginSchema } from '../../../../../backend/validations/auth.schema';
import { AuthService } from '../../../../../backend/services/auth.service';
import { ValidationError } from '../../../../../backend/lib/errors';
/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authenticated successfully
 */
export const POST = apiHandler(async (req: NextRequest) => {
  const body = await req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) throw new ValidationError('Validation Failed', parsed.error.errors);
  const { email, password } = parsed.data;
  const { user, token } = await AuthService.login(email, password);
  const response = NextResponse.json({ success: true, data: { user, token } });
  response.cookies.set({ name: 'token', value: token, httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 86400 });
  return response;
});
