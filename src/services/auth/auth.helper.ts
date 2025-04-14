import Cookies from 'js-cookie'

import { NODE_ENV } from '@/constants/constants'; // Определяет окружение: 'dev' или 'production'
import { EnumTokens } from '../auth/auth.service'; // Перечисление с именами токенов

/**
 * Получает access token из cookies.
 * @returns accessToken или null, если не найден.
 */
export const getAccessToken = () => {
	const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN)
	return accessToken || null
}

/**
 * Сохраняет access token в cookies.
 * @param accessToken - Токен доступа, который нужно сохранить.
 */
export const saveTokenStorage = (accessToken: string) => {
	Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
		// Устанавливаем домен в зависимости от окружения
		domain: NODE_ENV === 'dev' ? 'localhost' : 'redditads.netlify.app',
		sameSite: 'strict', // Повышает безопасность cookie
		expires: 1, // Срок действия: 1 день
	})
}

/**
 * Удаляет access token из cookies.
 */
export const removeFromStorage = () => {
	Cookies.remove(EnumTokens.ACCESS_TOKEN)
}
