import { removeFromStorage, saveTokenStorage } from '@/services/auth/auth.helper'
import authService from '@/services/auth/auth.service'
import { type AxiosInstance } from 'axios'
import { errorCatch } from './api.helper'

/**
 * Добавляет интерцептор к переданному экземпляру Axios, который:
 * - перехватывает ответ с ошибкой 401 (Unauthorized),
 * - пытается автоматически обновить токены с помощью refresh-токена,
 * - сохраняет новый accessToken,
 * - повторяет исходный запрос с новым токеном.
 *
 * Если refresh-токен недействителен или истёк — удаляет токены из хранилища.
 *
 * @param instance - экземпляр Axios, к которому добавляется интерцептор
 */
export function refreshInterceptor(instance: AxiosInstance) {
    instance.interceptors.response.use(
        // Если нет ошибки — просто вернуть конфиг как есть
        config => config,
        
        // Обработка ошибки ответа
        async error => {
            const originalRequest = error.config

            // Проверка: если это ошибка 401, и запрос ещё не помечен как повторный
            if (
                (error?.response?.status === 401) &&
                error.config &&
                !error.config._isRetry
            ) {
                originalRequest._isRetry = true
                try {
                    // Пытаемся получить новые токены
                    let response = await authService.getNewTokens()

                    // Если получен новый accessToken — сохранить и добавить в заголовки
                    if (response.accessToken) {
                        saveTokenStorage(response.accessToken)
                        originalRequest.headers.Authorization = `Bearer ${response.accessToken}`
                    }

                    // Также сохраняем ID пользователя, если есть
                    if (response.id) localStorage.setItem('userId', response.id)

                    // Повторяем исходный запрос
                    return instance.request(originalRequest)
                } catch (error) {
                    // Если refresh-токен невалидный или истёк — удаляем токены из хранилища
                    if (
                        errorCatch(error) === 'Invalid or expired refresh token'
                    )
                        removeFromStorage()
                }
            }

            // Если не обработано — пробросить ошибку дальше
            throw error
        }
    )
}
