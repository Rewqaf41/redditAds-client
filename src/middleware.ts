import { type NextRequest, NextResponse } from 'next/server'
import { EnumTokens } from './services/auth/auth.service'

export default async function middleware(req: NextRequest) {
	const token = req.cookies.get(EnumTokens.ACCESS_TOKEN)?.value

	if (!token) {
		return NextResponse.redirect(new URL("/login", req.url))
	}

	if (req.nextUrl.pathname === "/") {
		return NextResponse.redirect(new URL("/accounts", req.url))
}

}

export const config = {
	matcher: ["/", "/accounts", "/campaings", "/groups", "/ads", "/statistic"],
}