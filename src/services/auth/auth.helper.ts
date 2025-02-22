import Cookies from 'js-cookie'

import { NODE_ENV } from '@/constants/constants'
import { EnumTokens } from '../auth/auth.service'

export const getAccessToken = () => {
	const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN)
	return accessToken || null
}

export const saveTokenStorage = (accessToken: string) => {
	Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
		domain: NODE_ENV === 'dev' ? 'localhost' : 'redditads.netlify.app',
		sameSite: 'strict',
		expires: 1,
	})
}

export const removeFromStorage = () => {
	Cookies.remove(EnumTokens.ACCESS_TOKEN)
}
