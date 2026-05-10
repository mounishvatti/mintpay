import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
	const { nextUrl } = req;

	if (!req.auth) {
		const loginUrl = new URL("/login", nextUrl.origin);
		loginUrl.searchParams.set(
			"callbackUrl",
			`${nextUrl.pathname}${nextUrl.search}`,
		);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
});

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/profile/:path*",
		"/settings/:path*",
		"/banking/:path*",
	],
};
