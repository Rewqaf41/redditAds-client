"use client"
import { Checkbox } from "@/components/ui/common/Checkbox"
import { MultiSelect } from "@/components/ui/common/MultiSelect"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/common/Select"
import { adsStore } from "@/store/ads/ads.store"
import { groupStore } from "@/store/group/group.store"
import { llmStore } from "@/store/llm/llm.store"
import { IAdData } from "@/types/reddit/redditApi.types"
import axios from "axios"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { IoMdClose } from "react-icons/io"
import { InfoBadge } from "../../Badges/InfoBadge"
import DragAndDropForm from "../../DragAndDrop/DragAndDrop"
import Field from "../../Field/Field"
import styles from "../Ads.module.scss"
import data from "../callAction.data.json"

interface WindowComponentProps {
	isOpen: boolean
	onClose: () => void
}

interface ICallAction {
	action: string
	title: string
}

export function AddAds({ isOpen, onClose }: WindowComponentProps) {
	const [showWindow, setShowWindow] = useState(false)
	const [isGenerating, setIsGenerating] = useState(false)
	const [animatedHeadline, setAnimatedHeadline] = useState("Загрузка")
	const [headlineInterval, setHeadlineInterval] =
		useState<NodeJS.Timeout | null>(null)

	const { items: groups } = groupStore()
	const { baseUrl, model } = llmStore()

	const { addItem } = adsStore()

	const {
		control,
		handleSubmit,
		register,
		watch,
		reset,
		formState: { isValid },
	} = useForm<IAdData>({
		mode: "onChange",
	})

	const onSubmit = (data: IAdData) => {
		const NewAds = {
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
			groups: data.groups,
		}
		addItem(NewAds)
		toast.success("Рекламма создана")
		onClose()
		reset()
	}

	const handleImageUpload = async (file: File) => {
		const formData = new FormData()
		formData.append("file", file)
		formData.append("model", model)
		formData.append("baseUrl", baseUrl)

		setIsGenerating(true)

		try {
			const res = await axios.post("/api/chat", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})

			reset((prev) => ({
				...prev,
				headline: res.data.headline || "Ошибка! Добавьте заголовок вручную",
			}))
		} catch (error) {
			toast.error("Ошибка генерации заголовка")
		} finally {
			setIsGenerating(false)
		}
	}

	useEffect(() => {
		if (isGenerating) {
			let dots = 0
			const interval = setInterval(() => {
				dots = (dots + 1) % 4
				setAnimatedHeadline("Загрузка" + ".".repeat(dots))
			}, 500)
			setHeadlineInterval(interval)
		} else if (headlineInterval) {
			clearInterval(headlineInterval)
		}
		return () => {
			if (headlineInterval) clearInterval(headlineInterval)
		}
	}, [headlineInterval, isGenerating])

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
				<div className={styles.modal_content}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='bg-[#151f31] p-5 m-4 rounded-md'>
							<div className='mb-3'>Группы</div>
							<Controller
								name='groups'
								control={control}
								rules={{ required: true }}
								render={({ field }) => (
									<MultiSelect
										options={groups.map((item) => ({
											label: item.name,
											value: item.name,
										}))}
										onValueChange={field.onChange}
										placeholder='Select groups'
										animation={2}
										maxCount={10}
									/>
								)}
							/>
						</div>
						<div className='bg-[#151f31] p-5 m-4 rounded-md'>
							<div className='mb-3'>Детали</div>
							<div className='flex gap-x-2 mt-3'>
								<label className='opacity-70 text-sm'>Название рекламмы*</label>
								<InfoBadge side='top'>
									Как ваша реклама помечена на панели управления и в отчетах.
									Это имя не видно пользователям Reddit.
								</InfoBadge>
							</div>
							<Field
								className='border border-neutral-700 p-2 rounded-md'
								placeholder='Название кампании'
								{...register("name", { required: true })}
							/>
						</div>
						<div className='bg-[#151f31] p-5 m-4 rounded-md'>
							<div className='mb-3'>Создание поста</div>
							<div className='flex gap-x-2 mt-3'>
								<label className='opacity-70 text-sm'>Изображение *</label>
								<InfoBadge side='top'>
									Отображается в лентах, настроенных на просмотр карточек
									(настройка просмотра ленты по умолчанию). Рекомендуемые
									соотношения сторон: 1:1, 4:5, 4:3, 16:9 JPG, PNG или GIF макс.
									3 МБ
								</InfoBadge>
							</div>
							<DragAndDropForm onFileUploaded={handleImageUpload} />
							<div className='flex gap-x-2 mt-3'>
								<label className='opacity-70 text-sm'>Заголовок*</label>
								<InfoBadge side='top'>
									Используйте правильную грамматику, орфографию и пунктуацию.
								</InfoBadge>
							</div>
							<textarea
								maxLength={300}
								className='w-full bg-transparent border border-neutral-700 max-h-52 min-h-32 p-2 rounded-md placeholder:text-white/70'
								placeholder='Напишите убедительный заголовок'
								{...register("headline", { required: false })}
								value={isGenerating ? animatedHeadline : watch("headline")}
								readOnly={isGenerating}
							/>
							<div className='flex gap-x-2 mt-6'>
								<label className='opacity-70 text-sm'>
									URL-адрес назначения *
								</label>
								<InfoBadge side='top'>
									Ваша реклама будет направлять сюда пользователей Reddit.
									Дважды проверьте, что ссылка работает и xсоответствует
									<a
										href='https://business.reddithelp.com/s/article/Reddit-Advertising-Policy-Editorial-Requirements'
										target='_blank'
										className='underline text-blue-500 ml-1'
									>
										нашим требованиям.
									</a>
								</InfoBadge>
							</div>
							<Field
								className='border border-neutral-700 p-2 rounded-md'
								placeholder='https://'
								{...register("destination_url", { required: false })}
								defaultValue='https://'
							/>
							<div className='flex gap-x-2 mt-5'>
								<label className='opacity-70 text-sm'>Призыв к действию</label>
								<InfoBadge side='top'>
									Побуждает пользователей взаимодействовать с вашим постом таким
									образом, который соответствует цели вашей кампании.
								</InfoBadge>
							</div>
							<Controller
								name='call_to_action'
								rules={{ required: true }}
								control={control}
								render={({ field }) => (
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger className='w-full p-5 text-md'>
											<SelectValue className='p-3' placeholder='Выберите...' />
										</SelectTrigger>
										<SelectContent side='bottom'>
											{data.callAction.map((callToAction: ICallAction) => (
												<SelectItem
													key={callToAction.action}
													value={callToAction.action}
												>
													{callToAction.title}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
							<div className='flex gap-x-2 mt-5'>
								<label className='flex items-center gap-2'>
									<Controller
										name='allow_comments'
										control={control}
										defaultValue={false}
										render={({ field }) => (
											<Checkbox
												onCheckedChange={field.onChange}
												checked={field.value ?? false}
												className='data-[state=checked]:bg-transparent'
											/>
										)}
									/>
									Разрешить комментарии
								</label>
								<InfoBadge side='top'>
									Позвольте пользователям взаимодействовать с вашим постом и
									начинать общение с вами и другими пользователями.
								</InfoBadge>
							</div>
						</div>

						{/* Кнопка создания рекламы */}
						<div className={styles.buttons_group}>
							<div className={styles.button_add_wrapper}>
								<button
									type='submit'
									disabled={!isValid}
									className={styles.button_add}
								>
									Создать Рекламу
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	) : null
}
