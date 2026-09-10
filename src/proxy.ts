import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";

/**
 * Next 16 renamed Middleware to Proxy.
 *
 * Two jobs: gate the admin, and clear the redirect this domain used to serve.
 * Until the domain was moved onto our own server it answered with a permanent
 * 301 to another site, and browsers keep a 301 on disk more or less forever —
 * anyone who opened amarpara.in back then is still being sent away without a
 * request ever reaching us. Clear-Site-Data drops that entry, once per
 * visitor: the cookie survives the flush (only "cache" is cleared), so the
 * second visit is a normal one.
 */

const FLUSHED = "amarpara_cache";
/** Bump to flush every visitor again. */
const FLUSH = "1";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || (pathname.startsWith("/admin/") && !pathname.startsWith("/admin/login"))) {
    const token = request.cookies.get("amarpara_admin")?.value;
    if (!verifySession(token)) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("from", pathname);
      return NextResponse.redirect(login);
    }
  }

  const response = NextResponse.next();
  if (request.cookies.get(FLUSHED)?.value !== FLUSH) {
    // "cache" only: cookies and storage stay, so nobody is signed out.
    response.headers.set("Clear-Site-Data", '"cache"');
    response.cookies.set(FLUSHED, FLUSH, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      secure: true,
    });
  }
  return response;
}

export const config = {
  // Every page, but nothing the browser fetches as an asset.
  matcher: ["/((?!_next/static|_next/image|api/|images/|Fonts/|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)"],
};
