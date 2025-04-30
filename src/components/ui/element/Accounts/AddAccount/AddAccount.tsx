"use client"

import { accountStore } from "@/store/account/account.store"
import { adsStore } from "@/store/ads/ads.store"
import { campaingsStore } from "@/store/campaing/campaings.store"
import { groupStore } from "@/store/group/group.store"
import { IFormRedditAccounts } from "@/types/auth/auth.types"
import { generateRandomMetrics } from "@/utils/generateRandomMetrics"
import { faker } from "@faker-js/faker"
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
		const campaignFrequency = 3
		let accountIndex = accountStore.getState().items.length

		data.accounts.forEach((account, index) => {
			let metrics = {
				impressions: "0",
				spend: "0",
				clicks: "0",
				ecpm: "0",
				cpc: "0",
				ctr: "0",
			}

			if ((accountIndex + index) % campaignFrequency === 0) {
				metrics = generateRandomMetrics()

				const campaignName = faker.commerce.product()
				campaingsStore.getState().addItem({
					name: campaignName,
					status: "active",
					metrics: [metrics],
					createdBy: [account.username],
				})

				const groupName = `${faker.commerce.productAdjective()} ${campaignName}`
				groupStore.getState().addItem({
					name: groupName,
					status: "active",
					metrics: [metrics],
					campaigns: [campaignName],
				})

				const adsNames = [
					`${faker.commerce.product()} for ${campaignName}`,
					`${faker.commerce.productMaterial()} ${campaignName}`,
				]

				const splitMetric = (value: string, roundToInt = false) => {
					const num = parseFloat(value)
					const factors = [Math.random(), Math.random()]
					const sumFactors = factors.reduce((a, b) => a + b, 0)

					return factors.map((factor) => {
						const val = (factor / sumFactors) * num
						return roundToInt ? Math.round(val).toString() : val.toFixed(2)
					})
				}

				const [impressionsA, impressionsB] = splitMetric(
					metrics.impressions,
					true
				)
				const [spendA, spendB] = splitMetric(metrics.spend)
				const [clicksA, clicksB] = splitMetric(metrics.clicks, true)
				const [ecpmA, ecpmB] = splitMetric(metrics.ecpm)
				const [cpcA, cpcB] = splitMetric(metrics.cpc)
				const [ctrA, ctrB] = splitMetric(metrics.ctr)

				adsNames.forEach((adName, index) => {
					adsStore.getState().addItem({
						name: adName,
						status: "active",
						metrics: [
							{
								impressions:
									index === 0
										? impressionsA.toString()
										: impressionsB.toString(),
								spend: index === 0 ? spendA.toString() : spendB.toString(),
								clicks: index === 0 ? clicksA.toString() : clicksB.toString(),
								ecpm: index === 0 ? ecpmA.toString() : ecpmB.toString(),
								cpc: index === 0 ? cpcA.toString() : cpcB.toString(),
								ctr: index === 0 ? ctrA.toString() : ctrB.toString(),
							},
						],
						groups: [groupName],
					})
				})
			}

			accountStore.getState().addItem({
				username: account.username,
				status: "active",
				metrics: [metrics],
			})
		})

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
