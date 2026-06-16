import { SignJWT, jwtVerify } from "jose";
import { adminAuth } from "./firebase-admin";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "mariage-secret-senior-key-2024-etienne"
);

export interface AuthPayload {
  uid: string;
  ownerId: string;
  role: string;
  email?: string;
  name?: string;
}

export async function createToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch (error) {
    console.error("[Auth] verifyToken error:", error);
    return null;
  }
}

export async function validateRequest(request: Request): Promise<AuthPayload | null> {
  let token: string | undefined;

  // Debug all headers
  const allHeaders: any = {};
  request.headers.forEach((v, k) => { allHeaders[k] = v; });
  console.log(`[Auth] validateRequest all headers:`, JSON.stringify(allHeaders));

  // 1. Essayer l'en-tête Authorization
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2. Fallback sur le cookie 'auth-token'
  if (!token) {
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      // Split by semicolon and optional space
      const cookiesArr = cookieHeader.split(/;\s*/);
      const cookies: Record<string, string> = {};
      cookiesArr.forEach(c => {
        const [name, ...val] = c.split("=");
        if (name) cookies[name.trim()] = val.join("=").trim();
      });
      token = cookies["auth-token"];
    }
  }

  console.log(`[Auth] validateRequest token detected: ${token ? token.substring(0, 10) + '...' : 'NONE'}`);

  if (!token) return null;

  // 1. Tenter la vérification Firebase (Recommandé)
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return {
      uid: decodedToken.uid,
      ownerId: decodedToken.ownerId || (decodedToken.uid as string),
      role: decodedToken.role || "admin",
      email: decodedToken.email,
      name: decodedToken.name,
    };
  } catch (firebaseError) {
    console.log("[Auth] Firebase verification failed, trying JWT...");
    // 2. Fallback sur le JWT personnalisé (Ancien système)
    const payload = await verifyToken(token) as AuthPayload | null;
    console.log(`[Auth] JWT payload:`, payload);
    return payload;
  }
}
