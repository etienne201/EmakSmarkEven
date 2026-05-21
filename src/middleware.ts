import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "mariage-secret-senior-key-2024-etienne"
);

const SERVICE_PORTS = { user: 3000, api: 3001, admin: 3002 };

const SERVICE_ROUTES: Record<string, RegExp[]> = {
  user: [
    /^\/$/,
    /^\/login(\/.*)?$/,
    /^\/logout(\/.*)?$/,
    /^\/reglage(\/.*)?$/,
    /^\/home(\/.*)?$/,
    /^\/guest(\/.*)?$/,
    /^\/present(\/.*)?$/,
    /^\/table(\/.*)?$/,
    /^\/analytics(\/.*)?$/,
  ],
  api: [
    /^\/api(\/.*)?$/,
    /^\/api-docs(\/.*)?$/,
    /^\/docs(\/.*)?$/,
  ],
  admin: [
    /^\/superadmin(\/.*)?$/,
    /^\/login\/superadmin(\/.*)?$/,
  ],
};

const PUBLIC_ROUTES = [
  "/login", 
  "/login/superadmin",
  "/logout", 
  "/guest", 
  "/api/auth/admin/login", 
  "/api/auth/superadmin/login", 
  "/api-docs", 
  "/docs"
];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const port = request.nextUrl.port;
  
  // 1. Detect service mode
  let serviceMode = (process.env.SERVICE_MODE || "user") as "user" | "api" | "admin";
  if (port === "3000") serviceMode = "user";
  if (port === "3001") serviceMode = "api";
  if (port === "3002") serviceMode = "admin";

  const isVersioned = pathname.startsWith("/v1");
  let normalizedPath = isVersioned ? pathname.substring(3) : pathname;
  if (normalizedPath === "") normalizedPath = "/";

  // Handle CORS Preflight
  if (method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  // 2. Auth Guard
  const isPublicRoute = PUBLIC_ROUTES.some(route => normalizedPath === route || normalizedPath.startsWith(route + "/"));
  const isStaticAsset = pathname.startsWith("/_next") || pathname.includes(".");
  const isApiRoute = normalizedPath.startsWith("/api/") || normalizedPath === "/api";
  const token = request.cookies.get("auth-token")?.value;

  if (!isPublicRoute && !isApiRoute && !isStaticAsset) {
    if (!token) {
      const loginPath = serviceMode === "admin" ? "/login/superadmin" : "/login";
      return NextResponse.redirect(new URL(loginPath, request.url));
    }
    
    try {
      const { payload } = await jwtVerify(token, SECRET);
      const userRole = payload.role as string;
      
      if (serviceMode === "admin" && userRole !== "super-admin") {
        return NextResponse.redirect(new URL("/login/superadmin", request.url));
      }
    } catch (err) {
      const loginPath = serviceMode === "admin" ? "/login/superadmin" : "/login";
      return NextResponse.redirect(new URL(loginPath, request.url));
    }
  }

  // 3. Routing Logic
  
  // Special case: root path /
  if (normalizedPath === "/") {
    const targetPath = serviceMode === "admin" ? "/superadmin" : (serviceMode === "api" ? "/api-docs" : "/home");
    return NextResponse.rewrite(new URL(targetPath, request.url));
  }

  // Check if path is allowed on current service
  const isAllowed = (SERVICE_ROUTES[serviceMode] || []).some(p => p.test(normalizedPath));
  
  if (!isAllowed && !isPublicRoute && !isStaticAsset) {
    // Cross-service discovery
    for (const [mode, patterns] of Object.entries(SERVICE_ROUTES)) {
      if (mode === serviceMode) continue;
      if (patterns.some(p => p.test(normalizedPath))) {
        const targetUrl = new URL(normalizedPath + request.nextUrl.search, request.url);
        targetUrl.port = SERVICE_PORTS[mode as keyof typeof SERVICE_PORTS].toString();
        
        // For API requests, we use rewrite to act as a transparent proxy.
        // This prevents the browser from stripping the Authorization header during a cross-origin redirect.
        if (mode === "api" || normalizedPath.startsWith("/api/")) {
          const newHeaders = new Headers(request.headers);
          const auth = request.headers.get("authorization");
          if (auth) newHeaders.set("authorization", auth);
          
          return NextResponse.rewrite(targetUrl, {
            request: {
              headers: newHeaders,
            },
          });
        }
        
        return NextResponse.redirect(targetUrl);
      }
    }
  }

  // 4. Final internal routing
  if (!isStaticAsset) {
    console.log(`[Proxy] Routing ${method} ${pathname} -> Service: ${serviceMode} | Auth: ${token ? 'YES' : 'NO'}`);
  }
  
  if (isVersioned) {
    console.log(`[Proxy] Versioned Rewrite: ${normalizedPath}`);
    const newHeaders = new Headers(request.headers);
    const auth = request.headers.get("authorization");
    if (auth) newHeaders.set("authorization", auth);
    
    return NextResponse.rewrite(new URL(normalizedPath + request.nextUrl.search, request.url), {
      request: {
        headers: newHeaders,
      }
    });
  }

  console.log(`[Proxy] Finalizing ${pathname} with NextResponse.next()`);
  const response = NextResponse.next();
  console.log(`[Proxy] response.next() returned for ${pathname}`);

  // Attach CORS
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  return response;
}
