"use client"
import RedditAccount from "@/services/redditAccount.service"
import { IFormRedditAccount } from "@/types/auth.types"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { IoMdClose } from "react-icons/io"
import styles from "./AddAccount.module.scss"

interface WindowComponentProps {
	isOpen: boolean
	onClose: () => void
}

const AddAccount: React.FC<WindowComponentProps> = ({ isOpen, onClose }) => {
	const [showWindow, setShowWindow] = useState(false)
	const { register, handleSubmit, reset } = useForm<IFormRedditAccount>()
	const router = useRouter()
	const username: string = localStorage.getItem("username") || ""
	const searchParams = useSearchParams()

	useEffect(() => {
		const code = searchParams.get("code")
		if (code) {
			localStorage.setItem("username", "")
			;(async () =>
				await RedditAccount.addAccount({ username: username, code: code }))()
		}
	}, [searchParams])

	const onSubmit = (data: IFormRedditAccount) => {
		localStorage.setItem("username", data.username)
		router.push(
			"https://www.reddit.com/api/v1/authorize?client_id=6F9X7p7bpTzOLcerqiTwww&response_type=code&state=qwerty-qwerty&redirect_uri=https://redditads.netlify.app/accounts&duration=permanent&scope=adsread,adsconversions,history,adsedit,read"
		)
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
