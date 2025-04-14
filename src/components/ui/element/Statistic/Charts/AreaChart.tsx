"use client"

// Импортируем необходимые хранилища для работы с аккаунтами, кампаниями, группами и рекламами
import { accountStore } from "@/store/account/account.store"
import { adsStore } from "@/store/ads/ads.store"
import { campaingsStore } from "@/store/campaing/campaings.store"
import { groupStore } from "@/store/group/group.store"
import { MetricsType } from "@/store/types"
import {
	CategoryScale,
	Chart as ChartJS,
	Filler,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Tooltip,
} from "chart.js"
import { useMemo } from "react"
import { Line } from "react-chartjs-2"

// Регистрируем компоненты для работы с линейными диаграммами в Chart.js
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend,
	Filler
)

export function AreaChart() {
	// Получаем данные аккаунтов, выбранных аккаунтов, кампаний, выбранных кампаний, групп и выбранных групп из состояния
	const { items: accounts, selectedItems: selectedAccounts } = accountStore()
	const { items: campaigns, selectedItems: selectedCampaigns } =
		campaingsStore()
	const { items: groups, selectedItems: selectedGroups } = groupStore()
	const { items: ads, selectedItems: selectedAds } = adsStore()

	// Используем useMemo для объединения и фильтрации выбранных элементов (аккаунтов, кампаний, групп и реклам)
	const allSelectedItems = useMemo(() => {
		return [
			...accounts
				.filter((account) => selectedAccounts.includes(account.username))
				.map((account) => ({
					type: "Аккаунт", // Указываем тип для каждого элемента
					name: account.username,
					metrics: account.metrics || [], // Убираем null или undefined метрики
				})),
			...campaigns
				.filter((campaign) => selectedCampaigns.includes(campaign.name))
				.map((campaign) => ({
					type: "Кампания",
					name: campaign.name,
					metrics: campaign.metrics || [],
				})),
			...groups
				.filter((group) => selectedGroups.includes(group.name))
				.map((group) => ({
					type: "Группа",
					name: group.name,
					metrics: group.metrics || [],
				})),
			...ads
				.filter((ad) => selectedAds.includes(ad.name))
				.map((ad) => ({
					type: "Реклама",
					name: ad.name,
					metrics: ad.metrics || [],
				})),
		]
	}, [
		accounts,
		selectedAccounts,
		campaigns,
		selectedCampaigns,
		groups,
		selectedGroups,
		ads,
		selectedAds,
	])

	// Функция для вычисления метрик (eCPM, CPC, CTR)
	const calculateMetrics = (metrics: MetricsType[]) => {
		// Суммируем все eCPM, CPC и CTR
		const ecpm = metrics.reduce((sum, m) => sum + (Number(m.ecpm) || 0), 0)
		const cpc = metrics.reduce((sum, m) => sum + (Number(m.cpc) || 0), 0)
		const ctr = metrics.reduce((sum, m) => sum + (Number(m.ctr) || 0), 0)

		// Возвращаем массив с eCPM, CPC и CTR
		return [ecpm, cpc, ctr]
	}

	// Генерируем данные для каждой отдельной диаграммы (для каждого выбранного элемента)
	const individualCharts = allSelectedItems
		.filter(({ metrics }) => {
			// Фильтруем элементы с ненулевыми значениями метрик
			const [ecpm, cpc, ctr] = calculateMetrics(metrics)
			return ecpm > 0 || cpc > 0 || ctr > 0
		})
		.map(({ type, name, metrics }) => {
			// Для каждого элемента рассчитываем метрики и создаем метки для диаграммы
			const individualMetricsData = calculateMetrics(metrics)
			const individualLabels = ["ECPM", "CPC", "CTR"]

			// Возвращаем объект с данными для диаграммы
			return {
				title: `${type}: ${name}`, // Заголовок для диаграммы
				data: {
					labels: individualLabels, // Метки для диаграммы
					datasets: [
						{
							label: "Метрики", // Подпись для набора данных
							data: individualMetricsData, // Данные для диаграммы
							backgroundColor: "rgba(64, 193, 150, 0.2)", // Цвет заливки
							borderColor: "rgba(64, 193, 150, 1)", // Цвет обводки
							borderWidth: 2, // Толщина обводки
							fill: true, // Заполнение области графика
						},
					],
				},
			}
		})

	return (
		<div className='text-center'>
			<div className='flex flex-wrap gap-10'>
				{individualCharts.map(({ title, data }) => (
					<div key={title} className='w-[350px] h-[300px] text-center'>
						<h4 className='mb-[10px] text-[14px]'>{title}</h4>
						<div className='w-full h-full'>
							<Line
								data={data}
								options={{
									maintainAspectRatio: false, // Не сохранять пропорции
									plugins: {
										legend: {
											position: "top", // Позиция легенды сверху
										},
									},
									scales: {
										x: {
											grid: {
												display: false, // Отключаем сетку по оси X
											},
										},
										y: {
											beginAtZero: true, // Начинаем ось Y с нуля
										},
									},
								}}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
