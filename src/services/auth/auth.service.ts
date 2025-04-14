import { instance } from '@/api/axiosAuth'; // Конфигурированный axios instance с авторизацией
import { IFormAuth } from '@/types/auth/auth.types'; // Тип для формы авторизации
import { getAccessToken, removeFromStorage, saveTokenStorage } from '../auth/auth.helper'; // Утилиты для работы с токенами

// Интерфейс ответа от сервера при авторизации
interface IAuthResponse {
	id: string
	accessToken: string
}

// Перечисление имён токенов
export enum EnumTokens {
	'ACCESS_TOKEN' = 'accessToken',
	'REFRESH_TOKEN' = 'refreshToken',
}

class AuthService {
	/**
	 * Отправляет данные для логина пользователя.
	 * При успешном ответе сохраняет accessToken в cookie.
	 * @param data - Логин и пароль
	 */
	async login(data: IFormAuth) {
		const response = await instance.post<IAuthResponse>(
			`/login`,
			data
		)

		if (response.data.accessToken) {
			saveTokenStorage(response.data.accessToken)
		}

		return response
	}

	/**
	 * Регистрирует нового пользователя.
	 * При успехе сохраняет accessToken.
	 * @param data - Email и пароль
	 */
	async register(data: IFormAuth) {
		const response = await instance.post<IAuthResponse>(
			`/register`,
			data
		)

		if (response.data.accessToken) {
			saveTokenStorage(response.data.accessToken)
		}

		return response
	}

	/**
	 * Получает новую пару токенов по refreshToken (кука должна быть установлена).
	 * Используется для обновления авторизации без перезахода.
	 */
	async getNewTokens() {
		const response = await instance.post<IAuthResponse>(
			'/refresh-tokens',
			{},
			{
				withCredentials: true, // Отправка куки с refreshToken
			}
		)
		return response.data
	}

	/**
	 * Выход пользователя из системы.
	 * Отправляет токен на сервер и удаляет его из localStorage/cookie.
	 */
	async logout() {
		const accessToken = getAccessToken()

		try {
			const response = await instance.post<boolean>('/logout', {
				accessToken: accessToken || null,
			})

			if (response.data) {
				removeFromStorage()
			}

			return response
		} catch (error) {
			console.error('Logout error:', error)
			removeFromStorage()
			return { data: true } // Возвращает успешный ответ даже при ошибке, чтобы UI мог продолжить
		}
	}
}

const authService = new AuthService()
export default authService
