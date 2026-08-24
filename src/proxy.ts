import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";

/** Next 16 renamed Middleware to Proxy. Optimistic cookie check only —
 *  every admin action re-verifies the session server-side. */
export function proxy(request: NextRequest) {
  const token = request.cookies.get("amarpara_admin")?.value;
  if (verifySession(token)) return NextResponse.next();

  const login = new URL("/admin/login", request.url);
  login.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/((?!login).*)", "/admin"],
};
