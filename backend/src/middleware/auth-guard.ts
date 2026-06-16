import { validateRequest, AuthPayload } from "@backend/auth";
import { AppError } from "./error-handler";

export type Role = "super-admin" | "admin" | "staff" | "guest";

export async function authorize(request: Request, allowedRoles: Role[]): Promise<AuthPayload> {
  const payload = await validateRequest(request);
  if (!payload) {
    throw new AppError("Authentication required", 401);
  }

  const userRole = (payload.role as Role) || "guest";
  
  if (!allowedRoles.includes(userRole)) {
    throw new AppError("Access denied: insufficient permissions", 403);
  }

  return payload;
}

export const AuthGuard = {
  async superAdmin(request: Request) {
    return authorize(request, ["super-admin"]);
  },
  
  async admin(request: Request) {
    return authorize(request, ["super-admin", "admin"]);
  },

  async staff(request: Request) {
    return authorize(request, ["super-admin", "admin", "staff"]);
  },
  
  async guest(request: Request) {
    return authorize(request, ["super-admin", "admin", "staff", "guest"]);
  }
};
