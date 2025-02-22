import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AuthStore } from './auth.types'

export const authStore = create(persist<AuthStore>(
	set => ({
		isAuth: false,
		setIsAuth: (value: boolean) => set({ isAuth: value })
	}),
	{
		name: 'auth',
		storage: createJSONStorage(() => localStorage)
	}
))