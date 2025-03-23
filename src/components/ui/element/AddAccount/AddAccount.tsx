"use client"

import { IFormRedditAccounts } from "@/types/auth/auth.types"
import { FC, useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { FaMinus, FaPlus } from "react-icons/fa"
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
			defaultValues: { accounts: [{ username: "", password: "" }] },
		})
	const { fields, append, remove } = useFieldArray({
		control,
		name: "accounts",
		keyName: "id",
	})

	useEffect(() => {
		if (isOpen) {
			setTimeout(() => {
				setShowWindow(true)
			}, 100)
		} else {
			setShowWindow(false)
		}
	}, [isOpen])

	const onSubmit = (data: IFormRedditAccounts) => {
		console.log("Submitted data:", data)
		reset()
		onClose()
	}

	const handleAddField = () => {
		if (fields.length < 6) {
			append({ username: "", password: "" })
		}
	}

	const handleRemoveField = () => {
		if (fields.length > 1) {
			remove(fields.length - 1)
		}
	}

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
							<div className={styles.input_wrapper}>
								<input
									type='text'
									placeholder='Имя аккаунта'
									className={styles.input_field}
									{...register(`accounts.${index}.username`, {
										required: true,
									})}
									autoComplete='off'
								/>
							</div>
							<div className={styles.input_wrapper}>
								<input
									type='password'
									placeholder='Пароль'
									className={styles.input_field}
									{...register(`accounts.${index}.password`, {
										required: true,
									})}
									autoComplete='new-password'
								/>
							</div>
						</div>
					))}
					<div className={styles.buttons_group}>
						<div className={styles.counter_group}>
							<button
								type='button'
								className={styles.button_plus}
								onClick={handleAddField}
								disabled={fields.length >= 5}
							>
								<FaPlus />
							</button>
							<span className={styles.counter}>{fields.length}</span>
							<button
								type='button'
								className={styles.button_minus}
								onClick={handleRemoveField}
								disabled={fields.length <= 1}
							>
								<FaMinus />
							</button>
						</div>
						<div className={styles.button_add_wrapper}>
							<button type='submit' className={styles.button_add}>
								Добавить аккаунт{fields.length > 1 ? "ы" : ""}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	) : null
}

export default AddAccount
