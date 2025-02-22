import { removeFromStorage, saveTokenStorage } from '@/services/auth/auth.helper'
import authService from '@/services/auth/auth.service'
import { type AxiosInstance } from 'axios'
import { errorCatch } from './api.helper'

export function refreshInterceptor(instance: AxiosInstance) {
    instance.interceptors.response.use(
        config => config,
        async error => {
            const originalRequest = error.config

            if (
                (error?.response?.status === 401) &&
                error.config &&
                !error.config._isRetry
            ) {
                originalRequest._isRetry = true
                try {
                    let response = await authService.getNewTokens()
                    if (response.accessToken) {
                        saveTokenStorage(response.accessToken)
                        originalRequest.headers.Authorization = `Bearer ${response.accessToken}`
                    }
                    if (response.id) localStorage.setItem('userId', response.id)
                    return instance.request(originalRequest)
                } catch (error) {
                    if (
                        errorCatch(error) === 'Invalid or expired refresh token'
                    )
                        removeFromStorage()
                }
            }

            throw error
        }
    )
}