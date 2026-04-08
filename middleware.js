import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/interview(.*)",
  "/ai-cover-letter(.*)",
  "/onboarding(.*)",
  "/ai-roadmap(.*)",
  "/ai-chat(.*)",
  "/ai-chat-dashboard(.*)",
  "/chat(.*)",
  "/tools(.*)",
]);

const isApiRoute = createRouteMatcher([
  "/api/chat(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // 🔥 HANDLE API SEPARATELY
  if (!userId && isApiRoute(req)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 🔥 NORMAL PAGE REDIRECT
  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};