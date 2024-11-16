"use client"

import { getAccessToken } from '@/services/auth.helper'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useAuth(): boolean {
	const [isLoggedIn, setIsLoggedIn] = useState(false)
	const pathname = usePathname()

	useEffect(() => {
		const accessToken = getAccessToken()
		setIsLoggedIn(!!accessToken)
	}, [pathname])

	return isLoggedIn
}