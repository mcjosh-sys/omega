import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const publicRoutes = [
    "/site",
    "/api/uploadthing",
    "/sign-in",
    "/sign-up",
    "/agency/sign-in",
    "/agency/sign-up",
  ];

  if (!publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    await auth.protect();
  }

  // console.log({ route: req.nextUrl.pathname });

  const url = req.nextUrl;
  const searchParams = url.searchParams.toString();
  const pathWithSearchParams = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;
  const hostname = req.headers.get("host");

  const customSubDomain = hostname
    ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
    .filter(Boolean)[0]
    ?.split(".")[0];

  if (customSubDomain) {
    return NextResponse.rewrite(
      new URL(`/${customSubDomain}${pathWithSearchParams}`, req.nextUrl.origin)
    );
  }

  if (url.pathname === "/sign-in" && !url.searchParams.has("redirected")) {
    const signInUrl = new URL("/agency/sign-in", req.nextUrl.origin);
    signInUrl.searchParams.set("redirected", "true");
    return NextResponse.redirect(signInUrl);
  }

  if (url.pathname === "/sign-up" && !url.searchParams.has("redirected")) {
    const signUpUrl = new URL("/agency/sign-up", req.nextUrl.origin);
    signUpUrl.searchParams.set("redirected", "true");
    return NextResponse.redirect(signUpUrl);
  }

  if (
    url.pathname === "/" ||
    (url.pathname === "/site" && hostname === process.env.NEXT_PUBLIC_DOMAIN)
  ) {
    return NextResponse.rewrite(new URL("/site", req.url));
  }

  if (
    url.pathname.startsWith("/agency") ||
    url.pathname.startsWith("/subaccount")
  ) {
    return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
