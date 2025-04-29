"use client"

import { llmStore } from "@/store/llm/llm.store"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { IoMdClose } from "react-icons/io"
import Field from "../Field/Field"
import styles from "./ModelSettings.module.scss"

interface ModelSettingsProps {
	isOpen: boolean
	onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: ModelSettingsProps) {
	const [showWindow, setShowWindow] = useState(false)
	const { baseUrl, model, setBaseUrl, setModel } = llmStore()

	const {
		control,
		handleSubmit,
		register,
		setValue,
		reset,
		formState: { isValid },
	} = useForm<{ name: string; url: string }>({
		mode: "onChange",
		defaultValues: {
			name: model,
			url: baseUrl,
		},
	})

	useEffect(() => {
		if (isOpen) {
			setTimeout(() => setShowWindow(true), 100)
		} else {
			setShowWindow(false)
		}
	}, [isOpen])

	const onSubmit = (data: { name: string; url: string }) => {
		setModel(data.name)
		setBaseUrl(data.url)
		toast.success("Настройки модели сохранены")
		onClose()
		reset(data)
	}

	return showWindow ? (
		<div className={styles.modal}>
			<div className={styles.modal_container}>
				<div className={styles.modal_title}>
					<h1 className={styles.title}>Настройки модели</h1>
					<button onClick={onClose} className={styles.button_close}>
						<IoMdClose />
					</button>
				</div>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='bg-[#151f31] p-5 m-4 rounded-md'>
						<div className='mb-3'>Ссылка на модель*</div>
						<Field
							className='border border-neutral-700 p-2 rounded-md'
							placeholder='http://localhost:5000'
							{...register("url", { required: true })}
						/>
					</div>

					<div className='bg-[#151f31] p-5 m-4 rounded-md'>
						<div className='mb-3'>Название модели*</div>
						<Field
							className='border border-neutral-700 p-2 rounded-md'
							placeholder='llava-v1.5-7b'
							{...register("name", { required: true })}
						/>
					</div>

					<div className={styles.buttons_group}>
						<button
							type='submit'
							disabled={!isValid}
							className={styles.button_add}
						>
							Сохранить
						</button>
					</div>
				</form>
			</div>
		</div>
	) : null
}
