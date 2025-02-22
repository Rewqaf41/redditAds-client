"use client"

import { authStore } from '@/store/auth/auth.store'

export function useAuth() {
	const isAuth = authStore((state) => state.isAuth)
	const setIsAuth = authStore((state) => state.setIsAuth)

	const auth = () => setIsAuth(true)
	const exit = () => setIsAuth(false)

	return {
		isAuth,
		auth,
		exit,
	}
}