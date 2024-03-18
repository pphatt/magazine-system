import authConfig from "@/server/auth/auth.config"
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "@/server/routes"
import NextAuth from "next-auth"

export const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLogin = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // for oauth sign-in
  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLogin) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }

    return;
  }

  if (!isLogin && !isPublicRoute) {
    return Response.redirect(new URL("/signin", nextUrl))
  }

  return
})

// Optionally, don't invoke Middleware on some paths
// matcher using to detect the url as regex to trigger the auth function above
// if the url match the matcher, it will invoke the auth else don't
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
