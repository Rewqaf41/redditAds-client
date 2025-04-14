"use client"

// Импортируем хранилище состояния (authStore) из нашего Zustand стора
import { authStore } from '@/store/auth/auth.store'

/**
 * Хук `useAuth` управляет состоянием аутентификации пользователя.
 * Он использует Zustand для работы с глобальным состоянием аутентификации,
 * обеспечивая доступ к состоянию (пользователь аутентифицирован или нет)
 * и методы для изменения этого состояния.
 *
 * @returns объект с состоянием аутентификации и функциями для изменения его состояния:
 * - `isAuth`: состояние аутентификации (true/false)
 * - `auth`: функция для аутентификации (устанавливает isAuth в true)
 * - `exit`: функция для выхода (устанавливает isAuth в false)
 */
export function useAuth() {
	// Доступ к состоянию isAuth из хранилища Zustand
	const isAuth = authStore((state) => state.isAuth)
	// Доступ к методу setIsAuth для изменения состояния аутентификации
	const setIsAuth = authStore((state) => state.setIsAuth)

	// Функция для аутентификации (устанавливает isAuth в true)
	const auth = () => setIsAuth(true)
	// Функция для выхода (устанавливает isAuth в false)
	const exit = () => setIsAuth(false)

	// Возвращаем состояние и функции
	return {
		isAuth,
		auth,
		exit,
	}
}
