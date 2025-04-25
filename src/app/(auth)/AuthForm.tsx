"use client"

import { zodResolver } from "@hookform/resolvers/zod" // Импортируем резолвер для валидации с помощью Zod
import { useMutation } from "@tanstack/react-query" // Используем React Query для мутаций данных
import clsx from "clsx" // Используем clsx для условной генерации классов
import { useRouter } from "next/navigation" // Используем роутер для навигации
import { SubmitHandler, useForm } from "react-hook-form" // Используем React Hook Form для работы с формой
import toast from "react-hot-toast" // Для показа уведомлений

import { IFormAuth } from "@/types/auth/auth.types" // Типы для формы аутентификации

import { loginSchema, TypeLoginSchema } from "@/schemas/auth/auth.schema" // Схема для валидации формы
import Link from "next/link" // Для создания ссылок на страницы

import { useAuth } from "@/hooks/useAuth" // Хук для управления состоянием аутентификации
import { getAccessToken } from "@/services/auth/auth.helper" // Для получения токена из хранилища
import authService from "@/services/auth/auth.service" // Сервис для работы с аутентификацией
import { cn } from "@/utils/tw-merge" // Утилита для объединения классов
import { useEffect } from "react" // Для работы с побочными эффектами
import styles from "./AuthForm.module.scss" // Импорт стилей

interface AuthFormProps {
	isLogin: boolean // Флаг, указывающий, авторизуемся ли мы или регистрируем
}

// Компонент формы аутентификации
export function AuthForm({ isLogin }: AuthFormProps) {
	const {
		register, // Регистрация поля формы
		handleSubmit, // Обработчик отправки формы
		reset, // Сброс формы после успешной отправки
		formState: { errors, isValid }, // Состояние формы, включая ошибки и валидность
	} = useForm<TypeLoginSchema>({
		mode: "onChange", // Режим валидации при изменении поля
		resolver: zodResolver(loginSchema), // Применяем Zod для валидации
		defaultValues: {
			username: "",
			password: "",
		},
	})

	const { auth, exit } = useAuth() // Используем хук для управления состоянием аутентификации

	useEffect(() => {
		// Проверяем токен при монтировании компонента
		const token = getAccessToken()
		if (!token) {
			exit() // Если токена нет, выполняем выход
		}
	}, [exit])

	const router = useRouter() // Для роутинга

	// Мутация для логина
	const { mutate: mutateLogin, isPending: isLoginPending } = useMutation({
		mutationKey: ["login"], // Ключ для мутации
		mutationFn: (data: IFormAuth) => authService.login(data), // Функция для выполнения логина
		onSuccess() {
			auth() // При успешном логине вызываем функцию для авторизации
			reset() // Сбрасываем форму
			router.push("/accounts") // Переходим на страницу аккаунтов
			toast.success("Успешный вход") // Показываем успешное уведомление
		},
		onError() {
			toast.error("Неверный логин или пароль") // Показываем ошибку
		},
	})

	// Мутация для регистрации
	const { mutate: mutateRegister, isPending: isRegisterPending } = useMutation({
		mutationKey: ["register"],
		mutationFn: (data: IFormAuth) => authService.register(data), // Функция для выполнения регистрации
		onSuccess() {
			auth() // При успешной регистрации вызываем функцию для авторизации
			reset() // Сбрасываем форму
			router.push("/accounts") // Переходим на страницу аккаунтов
			toast.success("Регистрация успешна") // Показываем успешное уведомление
		},
		onError() {
			toast.error("Регистрация не удалась") // Показываем ошибку
		},
	})

	// Объединяем состояние ожидания для логина и регистрации
	const isPending = isLoginPending || isRegisterPending

	// Обработчик отправки формы
	const onSubmit: SubmitHandler<IFormAuth> = (data) => {
		if (isLogin) {
			mutateLogin(data) // Если форма для логина, выполняем логин
		} else {
			mutateRegister(data) // Если форма для регистрации, выполняем регистрацию
		}
	}

	return (
		<form
			className='font-[family-name:var(--font-monocraft)]'
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className='mb-4'>
				<label className='text-gray-600'>
					Логин
					<input
						type='text'
						placeholder='Введите логин'
						{...register("username")}
						className={clsx(
							styles["input-field"],
							"w-full h-10 p-2 border rounded focus:outline-none focus:border-indigo-500",
							errors.username ? "border-red-500" : ""
						)}
					/>
				</label>
				<p
					className={cn(
						"text-red-500 text-sm min-h-[10px] mt-1",
						styles["error-message"]
					)}
				>
					{errors.username?.message}
				</p>
			</div>

			<div className='mb-4'>
				<label className='text-gray-600'>
					Пароль
					<input
						type='password'
						placeholder='Введите пароль'
						{...register("password")}
						className={clsx(
							styles["input-field"],
							"w-full h-10 p-2 border rounded focus:outline-none focus:border-indigo-500",
							errors.password ? "border-red-500" : ""
						)}
					/>
				</label>
				<p className='text-red-500 text-sm min-h-[20px] mt-1'>
					{errors.password?.message}
				</p>
			</div>

			{isLogin ? (
				<Link className={styles.link} href='/register'>
					Создать аккаунт
				</Link>
			) : (
				<Link className={styles.link} href='/login'>
					Уже есть аккаунт? Войти{" "}
				</Link>
			)}

			<div className='mb-3 col-span-2'>
				<button
					type='submit'
					className={clsx(
						styles["btn-primary"],
						"bg-indigo-500",
						isPending || !isValid ? "opacity-75 cursor-not-allowed" : ""
					)}
					disabled={isPending || !isValid}
				>
					{isLogin ? "Войти" : "Регистрация"}
				</button>
			</div>
		</form>
	)
}
