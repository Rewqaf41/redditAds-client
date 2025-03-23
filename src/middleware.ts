import { type NextRequest, NextResponse } from 'next/server'
import { EnumTokens } from './services/auth/auth.service'

export default async function middleware(req: NextRequest) {
	const token = req.cookies.get(EnumTokens.REFRESH_TOKEN)?.value

	if (!token) {
		return NextResponse.redirect(new URL("/login", req.url))
	}

}

export const config = {
	matcher: ["/", "/accounts", "/campaings", "/groups", "/ads"],
}