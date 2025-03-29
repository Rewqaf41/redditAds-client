"use client"
import { MultiSelect } from "@/components/ui/common/MultiSelect"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/common/Select"
import { accountStore } from "@/store/account/account.store"
import { campaingsStore } from "@/store/campaing/campaings.store"
import type { Campaing } from "@/store/types"
import type { ICampingData } from "@/types/reddit/redditApi.types"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { IoMdClose } from "react-icons/io"
import { InfoBadge } from "../../Badges/InfoBadge"
import Field from "../../Field/Field"
import styles from "../Camping.module.scss"

interface WindowComponentProps {
	isOpen: boolean
	onClose: () => void
}

export function AddCamping({ isOpen, onClose }: WindowComponentProps) {
	const [showWindow, setShowWindow] = useState(false)
	const { addItem } = campaingsStore()
	const { items } = accountStore()

	const {
		control,
		handleSubmit,
		register,
		reset,
		watch,
		setValue,
		formState: { isValid },
	} = useForm<ICampingData>({
		mode: "onChange",
	})

	const onSubmit = (data: ICampingData) => {
		const NewCampaing: Campaing = {
			name: data.name,
			status: "active",
			metrics: [
				{
					impressions: "0",
					spend: "0",
					clicks: "0",
					ecpm: "0",
					cpc: "0",
					ctr: "0",
				},
			],
			createdBy: data.accounts,
		}

		addItem(NewCampaing)

		toast.success("Кампания создана")
		onClose()
		reset()
	}

	const spendCapValue = watch("spend_cap", "")

	useEffect(() => {
		if (!spendCapValue) return
		const numericValue = spendCapValue.replace(/\$/g, "").trim()
		if (!isNaN(Number(numericValue)) && numericValue !== "") {
			setValue("spend_cap", "$ " + numericValue, { shouldValidate: true })
		} else {
			setValue("spend_cap", numericValue, { shouldValidate: true })
		}
	}, [spendCapValue, setValue])

	const handleSpendCapChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let value = event.target.value.replace(/\$/g, "").trim()
		setValue("spend_cap", value, { shouldValidate: true })
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
					<h1 className={styles.title}>Создание кампании</h1>
					<button onClick={onClose} className={styles.button_close}>
						<IoMdClose />
					</button>
				</div>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='bg-[#151f31] p-5 m-4 rounded-md'>
						<div className='mb-3'>Кампании</div>
						<Controller
							name='accounts'
							control={control}
							rules={{ required: true }}
							render={({ field }) => (
								<MultiSelect
									options={items.map((item) => ({
										label: item.username,
										value: item.username,
									}))}
									onValueChange={field.onChange}
									placeholder='Select accounts'
									animation={2}
									maxCount={10}
								/>
							)}
						/>
					</div>
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
							name='objective'
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
								Ограничение расходов на кампанию <br /> (необязательно)
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
							placeholder='$ 0,00'
							{...register("spend_cap", {
								required: true,
								onChange: handleSpendCapChange,
							})}
						/>
					</div>

					<div className={styles.buttons_group}>
						<div className={styles.button_add_wrapper}>
							<button
								type='submit'
								disabled={!isValid}
								className={styles.button_add}
							>
								Создать Кампанию
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	) : null
}
