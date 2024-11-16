"use client"
import redditAccountService from "@/services/redditAccount.service"
import { IFormRedditAccount } from "@/types/auth.types"
import { useMutation } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { IoMdClose } from "react-icons/io"
import styles from "./AddAccount.module.scss"

interface WindowComponentProps {
	isOpen: boolean
	onClose: () => void
}

const AddAccount: React.FC<WindowComponentProps> = ({ isOpen, onClose }) => {
	const [showWindow, setShowWindow] = useState(false)
	const { register, handleSubmit, reset } = useForm<IFormRedditAccount>()

	const { mutate: mutateAddAccount } = useMutation({
		mutationKey: ["addAccount"],
		mutationFn: (data: IFormRedditAccount) =>
			redditAccountService.addAccount(data),
		onError() {
			toast.error("Something went wrong")
		},
		onSuccess() {
			reset()
			onClose()
			toast.success("Account added successfully")
		},
	})

	const onSubmit = (data: IFormRedditAccount) => {
		mutateAddAccount(data)
	}

	useEffect(() => {
		if (isOpen) {
			setTimeout(() => {
				setShowWindow(true)
			}, 100)
		} else {
			setShowWindow(false)
		}
	}, [isOpen])

	return showWindow ? (
		<div className={styles.modal}>
			<div className={styles.modal_container}>
				<div className={styles.modal_title}>
					<h1 className={styles.title}>Добавление аккаунта</h1>
					<button onClick={onClose} className={styles.button_close}>
						<IoMdClose />
					</button>
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
					<div className={styles.input_group}>
						<input
							type='text'
							placeholder='Имя аккаунта: '
							className={styles.input_field}
							{...register("username", { required: true })}
							autoComplete='new-password'
						/>
						<input
							type='password'
							placeholder='Пароль: '
							className={styles.input_field}
							{...register("password", { required: true })}
							autoComplete='new-password'
						/>
					</div>
					<button type='submit' className={styles.button_add}>
						Добавить аккаунт
					</button>
				</form>
			</div>
		</div>
	) : null
}

export default AddAccount
