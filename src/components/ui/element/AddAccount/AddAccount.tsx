"use client"

import RedditAccount from "@/services/reddit/redditAccount.service"
import { IFormRedditAccounts } from "@/types/auth/auth.types"
import { useSearchParams } from "next/navigation"
import { FC, useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { IoMdClose } from "react-icons/io"
import styles from "./AddAccount.module.scss"

interface WindowComponentProps {
	isOpen: boolean
	onClose: () => void
}

const AddAccount: FC<WindowComponentProps> = ({ isOpen, onClose }) => {
	const [showWindow, setShowWindow] = useState(false)
	const { register, handleSubmit, reset, control } =
		useForm<IFormRedditAccounts>({
			defaultValues: { accounts: [{ username: "" }] },
		})
	const { fields, append, remove } = useFieldArray({
		control,
		name: "accounts",
		keyName: "id",
	})
	const searchParams = useSearchParams()

	useEffect(() => {
		const code = searchParams.get("code")
		if (code) {
			;(async () => {
				try {
					const response = await RedditAccount.addAccount({
						username: localStorage.getItem("username") || "",
						code: code,
					})
					if (response.status === 200) {
						window.close()
					}
				} catch (error) {
					console.error("Ошибка при добавлении аккаунта:", error)
				}
			})()
		}
	}, [searchParams])

	const openRedditTabs = (accounts: { username: string }[]) => {
		accounts.forEach((account) => {
			const url = `https://www.reddit.com/api/v1/authorize?client_id=6F9X7p7bpTzOLcerqiTwww&response_type=code&state=qwerty-qwerty&redirect_uri=https://redditads.netlify.app/accounts&duration=permanent&scope=adsread,adsconversions,history,adsedit,read&username=${account.username}`
			window.open(url, "_blank")
		})
	}

	const onSubmit = (data: IFormRedditAccounts) => {
		const usernames = data.accounts.map((account) => account.username).join(",")
		localStorage.setItem("accounts", usernames)

		openRedditTabs(data.accounts)

		reset()
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
					{fields.map((field, index) => (
						<div key={field.id} className={styles.input_group}>
							<input
								type='text'
								placeholder='Имя аккаунта: '
								className={styles.input_field}
								{...register(`accounts.${index}.username`, { required: true })}
								autoComplete='off'
							/>
						</div>
					))}
					<div className={styles.buttons_group}>
						<div className={styles.button_add_wrapper}>
							<button type='submit' className={styles.button_add}>
								Добавить аккаунт
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	) : null
}

export default AddAccount
