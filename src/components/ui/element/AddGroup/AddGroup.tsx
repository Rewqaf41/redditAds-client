"use client"
import cn from "clsx"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { IoMdClose } from "react-icons/io"
import { Checkbox } from "../../common/Checkbox"
import { Label } from "../../common/Label"
import { RadioGroup, RadioGroupItem } from "../../common/RadioGroup"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../common/Select"
import { InfoBadge } from "../Badges/InfoBadge"
import { Button } from "../Button/Button"
import { CalendarForm } from "../CalendarFrom/CalendarFrom"
import Field from "../Field/Field"
import styles from "./AddGroup.module.scss"

interface WindowComponentProps {
	isOpen: boolean
	onClose: () => void
}

export function AddGroup({ isOpen, onClose }: WindowComponentProps) {
	const [showWindow, setShowWindow] = useState(false)
	const [selectedGender, setSelectedGender] = useState<string | null>()
	const [selectedDevis, setSelectedDevis] = useState<string | null>()
	const [isIOS, setIsIOS] = useState(false)
	const [isAndroid, setIsAndroid] = useState(false)
	const [isDesktop, setIsDesktop] = useState(false)

	const { handleSubmit, register, setValue, reset, control, watch } = useForm()

	const onSubmit = (data: any) => {
		console.log(data)
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

	useEffect(() => {
		setValue("goal_value", "$50.00")
	}, [setValue])

	const value = watch("goal_value", "$50.00")

	const handleGenderSelect = (gender: string | null) => {
		setSelectedGender(gender)
		console.log(selectedGender)
		setValue("gender", gender, { shouldDirty: true })
	}

	const handleDeviceSelect = (device: string | null) => {
		setSelectedDevis(device)
		setValue("device", device ?? null, { shouldDirty: true })
	}

	return showWindow ? (
		<div className={styles.modal}>
			<div className={styles.modal_container}>
				<div className={styles.modal_title}>
					<h1 className={styles.title}>Создание Группы</h1>
					<button onClick={onClose} className={styles.button_close}>
						<IoMdClose />
					</button>
				</div>
				<div className={styles.modal_content}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='bg-[#151f31] p-5 m-4 rounded-md'>
							<div className='mb-3'>Название</div>
							<Field
								className='border border-neutral-700 p-2 rounded-md'
								placeholder='Название группы'
								{...register("name", { required: true })}
							/>
						</div>

						<h1 className='m-5 font-bold text-lg'>Определите свою аудиторию</h1>
						{/* Reddit Audiences */}
						<div className='bg-[#151f31] p-5 m-4 rounded-md'>
							<div className='mb-3'>Аудитория Reddit</div>
							<div className='flex gap-x-2'>
								<label className='opacity-70 text-sm'>Ключивые слова</label>
								<InfoBadge side='top'>
									Нацельтесь на Redditers, которые взаимодействуют с
									определенными ключевыми словами. Вы можете загрузить до 1000
									ключевых слов.
								</InfoBadge>
							</div>
							<Field
								className='border border-neutral-700 p-2 rounded-md'
								placeholder='Пример: Apple'
								{...register("keywords")}
							/>
							<div className='flex gap-x-2 mt-3'>
								<label className='opacity-70 text-sm'>
									Аудитория сообщества
								</label>
								<InfoBadge side='top'>
									Нацельтесь на членов сообщества и пользователей Reddit,
									которые недавно взаимодействовали с этим сообществом.
								</InfoBadge>
							</div>
							<Field
								className='border border-neutral-700 p-2 rounded-md'
								placeholder='Например: Игры, Красота, Путешествия...'
								{...register("communities")}
							/>
							<div className='flex gap-x-2 mt-3'>
								<label className='opacity-70 text-sm'>
									Группы по интересам
								</label>
								<InfoBadge side='top'>
									Таргетинг пользователей на основе их интересов, определяемых
									контентом, с которым они недавно взаимодействовали.
								</InfoBadge>
							</div>
							<Field
								className='border border-neutral-700 p-2 rounded-md'
								placeholder='Например: Игры, Здоровье, Финансы...'
								{...register("interests")}
							/>
						</div>
						{/* Custom Audiences */}
						<div className='bg-[#151f31] p-5 m-4 rounded-md'>
							<div className='flex gap-x-2'>
								<div className='mb-3'>Пользовательские аудитории</div>
								<InfoBadge side='top'>
									Выберите или создайте пользовательские аудитории, которые вы
									хотите включить или исключить из своего таргетинга.
								</InfoBadge>
							</div>
							<label className='opacity-70 text-sm'>
								Включены пользовательские аудитории
							</label>
							<Field
								className='border border-neutral-700 p-2 rounded-md'
								placeholder='Например: NewAccount_2022'
							/>
							<div className='mt-3'>
								<label className='opacity-70 text-sm'>
									Исключенные пользовательские аудитории
								</label>
								<Field
									className='border border-neutral-700 p-2 rounded-md'
									placeholder='Например: NewAccount_2022'
								/>
							</div>
						</div>
						{/* Демография */}
						<div className='bg-[#151f31] p-5 m-4 rounded-md'>
							<div className='flex gap-x-2'>
								<div className='mb-3'>Демография</div>
								<InfoBadge side='top'>
									Выберите местоположения, которые следует включить или
									исключить из таргетинга.
								</InfoBadge>
							</div>
							<label className='opacity-70 text-sm'>
								Включить местоположения
							</label>
							<Field
								className='border border-neutral-700 p-2 rounded-md'
								placeholder='Например: Регион, DMA, Страна, почтовый индекс, город'
								{...register("geolocations")}
							/>
							<div className='mt-3'>
								<label className='opacity-70 text-sm'>
									Исключить местоположения
								</label>
								<Field
									className='border border-neutral-700 p-2 rounded-md'
									placeholder='Например: Регион, DMA, Страна, почтовый индекс, город'
									{...register("excluded_geolocations")}
								/>
							</div>
							<div className='mt-3'>
								<label>Пол</label>
								<div className='flex gap-x-2'>
									<Button
										type='button'
										className={cn({
											"border-black": selectedGender === null,
										})}
										onClick={() => handleGenderSelect(null)}
									>
										Все
									</Button>
									<Button
										type='button'
										className={cn({
											"border-black": selectedGender === "MALE",
										})}
										onClick={() => handleGenderSelect("MALE")}
									>
										Мужчины
									</Button>
									<Button
										type='button'
										className={cn({
											"border-black": selectedGender === "FEMALE",
										})}
										onClick={() => handleGenderSelect("FEMALE")}
									>
										Женщины
									</Button>
								</div>
							</div>
						</div>
						{/* Устройства */}
						<div className='bg-[#151f31] p-5 m-4 rounded-md'>
							<div className='flex gap-x-2'>
								<div className='mb-3'>Устройства</div>
								<InfoBadge side='top'>
									Выберите типы устройств или операторов сотовой связи для
									таргетинга.
								</InfoBadge>
							</div>
							<label className='opacity-70 text-sm'>Тип</label>
							<div className='flex gap-x-1'>
								<Button
									className={cn({ "border-black": selectedDevis === null })}
									type='button'
									onClick={() => handleDeviceSelect(null)}
								>
									Все
								</Button>
								<Button
									className={cn({ "border-black": selectedDevis === "custom" })}
									type='button'
									onClick={() => setSelectedDevis("custom")}
								>
									Пользовательские
								</Button>
							</div>
							{selectedDevis === "custom" ? (
								<div className='mt-3'>
									<label className='opacity-70 text-sm'>Конкретные типы</label>
									<div>
										<div>
											<Checkbox
												onClick={() => setIsIOS(!isIOS)}
												className='data-[state=checked]:bg-transparent'
											/>
											iOS
										</div>
										<div>
											<Checkbox
												onClick={() => setIsAndroid(!isAndroid)}
												className='data-[state=checked]:bg-transparent'
											/>
											Андроид
										</div>
										<div>
											<Checkbox
												onClick={() => setIsDesktop(!isDesktop)}
												className='data-[state=checked]:bg-transparent'
											/>
											Пк
										</div>
									</div>
									{isIOS && (
										<div className='mt-3'>
											<label className='opacity-70 text-sm'>
												iOS-устройства
											</label>
											<Field
												className='border border-neutral-700 p-2 rounded-md'
												placeholder='Например: iPhone 16 Pro Max'
												{...register("ios_devices", { required: false })}
											/>
										</div>
									)}

									{isAndroid && (
										<div className='mt-3'>
											<label className='opacity-70 text-sm'>
												Андроид устройства
											</label>
											<Field
												className='border border-neutral-700 p-2 rounded-md'
												placeholder='Например: Galaxy S21 Ultra 5G'
												{...register("android_devices", { required: false })}
											/>
										</div>
									)}
								</div>
							) : null}
							<div className='mt-3'>
								<label className='opacity-70 text-sm'>Сотовые носители</label>
								<Field
									className='border border-neutral-700 p-2 rounded-md'
									placeholder='Например: Verizon US'
									{...register("carriers", { required: false })}
								/>
							</div>
						</div>

						<h1 className='m-5 font-bold text-lg'>Выберите места размещения</h1>

						<div className='bg-[#151f31] p-5 m-4 rounded-md'>
							<div className='flex gap-x-2'>
								<div className='mb-3'>Размещения</div>
								<InfoBadge side='top'>
									Выберите , где на Reddit вы хотите разместить свою рекламу.
								</InfoBadge>
							</div>
							<div>
								<label className='opacity-70 text-sm'>Размещения</label>
								<RadioGroup defaultValue='option-one'>
									<div className='flex items-center space-x-2'>
										<RadioGroupItem value='option-one' id='auto' />
										<Label htmlFor='auto'>Автоматическое размещение</Label>
									</div>
									<div className='flex items-center space-x-2'>
										<RadioGroupItem value='option-two' id='manual' />
										<Label htmlFor='manual'>Ручное размещение</Label>
									</div>
								</RadioGroup>
							</div>
							<div className='border-b border-neutral-700 mt-3' />
							<div className='mt-3'>
								<div className='mb-3'>Безопасность бренда</div>
								<div className='flex gap-x-2'>
									<label className='opacity-70 text-sm'>
										Исключить сообщества
									</label>
									<InfoBadge side='top'>
										Запретите размещение вашей рекламы в определенных
										сообществах.
									</InfoBadge>
								</div>
								<Field
									className='border border-neutral-700 p-2 rounded-md'
									placeholder='Например политика'
									{...register("excluded_communities", { required: false })}
								/>
								<div className='flex gap-x-2 mt-3'>
									<label className='opacity-70 text-sm'>
										Исключить ключевые слова
									</label>
									<InfoBadge side='top'>
										Не допускайте размещения вашей рекламы рядом с определенными
										ключевыми словами.
									</InfoBadge>
								</div>
								<Field
									className='border border-neutral-700 p-2 rounded-md'
									placeholder='Например политика'
									{...register("excluded_keywords", { required: false })}
								/>
							</div>
						</div>

						<h1 className='m-5 font-bold text-lg'>Настроить доставку</h1>

						<div className='bg-[#151f31] p-5 m-4 rounded-md'>
							<div className='mb-3'>Бюджет и график</div>

							<div className='flex gap-x-4'>
								{/* Поле бюджета */}
								<div className='flex flex-col flex-1'>
									<div className='flex items-center gap-x-2'>
										<label className='opacity-70 text-sm'>Бюджет</label>
										<InfoBadge side='top'>
											Сумма, которую вы готовы потратить на свою группу
											объявлений.
										</InfoBadge>
									</div>
									<Field
										className='border border-neutral-700 p-2 rounded-md mt-1'
										placeholder='$50.00'
										{...register("goal_value", {
											required: true,
											onChange(e) {
												let rawValue = e.target.value.replace(/[^0-9.]/g, "")
												setValue("goal_value", rawValue ? `$${rawValue}` : "")
											},
										})}
									/>
								</div>

								{/* Поле типа бюджета */}
								<div className='flex flex-col flex-1'>
									<div className='flex gap-x-2'>
										<label className='opacity-70 text-sm'>Тип бюджета</label>
										<InfoBadge side='top'>
											Дневной бюджетустанавливает максимальные расходы на каждый
											день показа вашей группы объявлений. Бюджет на всю
											жизньустанавливает максимальные расходы за выбранный
											диапазон дат.
										</InfoBadge>
									</div>
									<Controller
										name='goal_type'
										control={control}
										render={({ field }) => (
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<SelectTrigger className='w-full p-5 text-md mt-1 border border-neutral-700 rounded-md'>
													<SelectValue placeholder='Выберите тип бюджета' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='DAILY_SPEND'>Ежедневно</SelectItem>
													<SelectItem value='LIFETIME_SPEND'>
														Пожизненно
													</SelectItem>
												</SelectContent>
											</Select>
										)}
									/>
								</div>
							</div>
							<div className='mt-3'>
								<Controller
									control={control}
									name='start_time'
									render={({ field, fieldState }) => (
										<CalendarForm
											field={field}
											fieldState={fieldState}
											label='Дата начала'
											placeholder='Выберите дату начала'
											setValue={setValue}
										/>
									)}
								/>
								<label className='opacity-70 text-sm'>Дата начала</label>
							</div>
						</div>

						<div className={styles.buttons_group}>
							<div className={styles.button_add_wrapper}>
								<button type='submit' className={styles.button_add}>
									Создать Группу
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	) : null
}
