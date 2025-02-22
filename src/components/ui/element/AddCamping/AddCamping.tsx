"use client"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { IoMdClose } from "react-icons/io"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../common/Select"
import { InfoBadge } from "../Badges/InfoBadge"
import Field from "../Field/Field"
import styles from "./AddCamping.module.scss"

interface WindowComponentProps {
	isOpen: boolean
	onClose: () => void
}

export function AddCamping({ isOpen, onClose }: WindowComponentProps) {
	const [showWindow, setShowWindow] = useState(false)

	const { control, handleSubmit, register, watch, setValue } = useForm()

	const onSubmit = (data: any) => {
		console.log(data)
		toast.success("Кампания создана")
		onClose()
	}

	const spendCapValue = watch("spend_cap", "")

	useEffect(() => {
		if (spendCapValue) {
			const cleanedValue = spendCapValue.replace(/\$/g, "").trim()
			setValue("spend_cap", cleanedValue + "$", { shouldValidate: true })
		}
	}, [spendCapValue, setValue])

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
					<h1 className={styles.title}>Создание кампании</h1>
					<button onClick={onClose} className={styles.button_close}>
						<IoMdClose />
					</button>
				</div>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='bg-[#151f31] p-5 m-4 rounded-md'>
						<div className='mb-3'>Детали</div>
						<Field
							className='border border-neutral-700 p-2 rounded-md'
							placeholder='Название кампании'
							{...register("name", { required: true })}
						/>
					</div>
					<div className='bg-[#151f31] p-5 m-4 rounded-md'>
						<div className='flex gap-x-2 mb-3'>
							<div>Цель</div>
							<div>
								<InfoBadge side='top'>
									Чего вы хотите добиться с помощью своей рекламной кампании.
									Цели кампании имеют разные оптимизации и модели оплаты.
								</InfoBadge>
							</div>
						</div>
						<Controller
							name='object'
							control={control}
							render={({ field }) => (
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger className='w-full p-5 text-md'>
										<SelectValue className='p-3' placeholder='Выберите цель' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='IMPRESSIONS'>
											Узнаваемость бренда и охват
										</SelectItem>
										<SelectItem value='CLICKS'>Трафик</SelectItem>
										<SelectItem value='CONVERSIONS'>Конверсии</SelectItem>
										<SelectItem value='VIDEO_VIEWABLE_IMPRESSIONS'>
											Просмотры видео
										</SelectItem>
										<SelectItem value='APP_INSTALLS'>
											Установки приложений
										</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>

					<div className='bg-[#151f31] p-5 m-4 rounded-md'>
						<div className='mb-3'>Расходы</div>
						<div className='flex gap-x-2 mb-2'>
							<label className='opacity-70 text-sm'>
								Ограничение расходов на кампанию (необязательно)
							</label>
							<div>
								<InfoBadge>
									Укажите, сколько ваша кампания должна потратить за время
									своего существования. Кампании никогда не будут оплачиваться
									больше, чем заложено в их бюджет.
								</InfoBadge>
							</div>
						</div>
						<Field
							className='border border-neutral-700 p-2 rounded-md'
							placeholder='0,00 $'
							{...register("spend_cap", { required: false })}
						/>
					</div>

					<div className={styles.buttons_group}>
						<div className={styles.button_add_wrapper}>
							<button type='submit' className={styles.button_add}>
								Создать Кампанию
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	) : null
}
