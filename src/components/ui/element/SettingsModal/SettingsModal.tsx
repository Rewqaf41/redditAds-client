"use client"

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/common/Select"
import { llmStore } from "@/store/llm/llm.store"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
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
						<Controller
							name='name'
							control={control}
							rules={{ required: true }}
							render={({ field }) => (
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger className='w-full p-5 text-md'>
										<SelectValue placeholder='Выберите модель' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='gemma-3-4b-it'>gemma-3-4b-it</SelectItem>
										<SelectItem value='llava-v1.5-7b'>llava-v1.5-7b</SelectItem>
									</SelectContent>
								</Select>
							)}
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
