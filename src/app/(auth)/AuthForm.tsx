"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"

import { IFormAuth } from "@/types/auth/auth.types"

import { loginSchema, TypeLoginSchema } from "@/schemas/auth/auth.schema"
import Link from "next/link"

import { useAuth } from "@/hooks/useAuth"
import { getAccessToken } from "@/services/auth/auth.helper"
import authService from "@/services/auth/auth.service"
import { useEffect } from "react"
import styles from "./AuthForm.module.scss"

interface AuthFormProps {
	isLogin: boolean
}

export function AuthForm({ isLogin }: AuthFormProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm<TypeLoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	})

	const { auth, exit } = useAuth()

	useEffect(() => {
		const token = getAccessToken()
		if (!token) {
			exit()
		}
	}, [exit])

	const router = useRouter()

	const { mutate: mutateLogin, isPending: isLoginPending } = useMutation({
		mutationKey: ["login"],
		mutationFn: (data: IFormAuth) => authService.login(data),
		onSuccess() {
			auth()
			reset()
			router.push("/accounts")
			toast.success("Успешный вход")
		},
		onError() {
			toast.error("Вход не удался")
		},
	})

	const { mutate: mutateRegister, isPending: isRegisterPending } = useMutation({
		mutationKey: ["register"],
		mutationFn: (data: IFormAuth) => authService.register(data),
		onSuccess() {
			auth()
			reset()
			router.push("/accounts")
			toast.success("Регистрация успешна")
		},
		onError() {
			toast.error("Регистрация не удалась")
		},
	})

	const isPending = isLoginPending || isRegisterPending

	const onSubmit: SubmitHandler<IFormAuth> = (data) => {
		if (isLogin) {
			mutateLogin(data)
		} else {
			mutateRegister(data)
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
				<p className='text-red-500 text-sm min-h-[20px] mt-1'>
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
