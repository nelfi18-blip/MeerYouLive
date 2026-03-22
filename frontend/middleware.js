export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - / (home page – public)
     * - /login, /register (auth pages – must stay public to avoid infinite redirects)
     * - /auth/* (NextAuth callback and error pages)
     * - /api/auth/* (NextAuth API routes)
     * - /explore (public discovery page)
     * - /_next/* (Next.js internals)
     * - /favicon.ico, /robots.txt (static assets)
     */
    "/((?!$|login|register|auth|api\\/auth|explore|_next|favicon\\.ico|robots\\.txt).*)",
  ],
};
