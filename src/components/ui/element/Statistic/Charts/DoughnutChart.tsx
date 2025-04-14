"use client"

// Импортируем необходимые хранилища для работы с аккаунтами, кампаниями, группами и рекламами
import { accountStore } from "@/store/account/account.store"
import { adsStore } from "@/store/ads/ads.store"
import { campaingsStore } from "@/store/campaing/campaings.store"
import { groupStore } from "@/store/group/group.store"
import { MetricsType } from "@/store/types"
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js"
import { useMemo } from "react"
import { Doughnut } from "react-chartjs-2"

// Регистрируем компоненты для работы с круговыми диаграммами в Chart.js
ChartJS.register(ArcElement, Tooltip, Legend)

export function DoughnutChart() {
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

	// Функция для вычисления метрик (показов, расходов и кликов)
	const calculateMetrics = (metrics: MetricsType[]) => {
		// Суммируем все показы, расходы и клики
		const impressions = metrics.reduce(
			(sum, m) => sum + (Number(m.impressions) || 0),
			0
		)
		const spend = metrics.reduce((sum, m) => sum + (Number(m.spend) || 0), 0)
		const clicks = metrics.reduce((sum, m) => sum + (Number(m.clicks) || 0), 0)

		// Возвращаем массив с показами, расходами и кликами
		return [impressions, spend, clicks]
	}

	// Генерируем данные для каждой отдельной диаграммы (для каждого выбранного элемента)
	const individualCharts = allSelectedItems
		.filter(({ metrics }) => {
			// Фильтруем элементы с ненулевыми значениями метрик
			const [impressions, spend, clicks] = calculateMetrics(metrics)
			return impressions > 0 || spend > 0 || clicks > 0
		})
		.map(({ type, name, metrics }) => {
			// Для каждого элемента рассчитываем метрики и создаем метки для диаграммы
			const individualMetricsData = calculateMetrics(metrics)
			const individualLabels = [
				`Показы (${individualMetricsData[0]})`,
				`Расход (${individualMetricsData[1]})`,
				`Клики (${individualMetricsData[2]})`,
			]

			// Возвращаем объект с данными для диаграммы
			return {
				title: `${type}: ${name}`, // Заголовок для диаграммы
				data: {
					labels: individualLabels, // Метки для диаграммы
					datasets: [
						{
							data: individualMetricsData, // Данные для диаграммы
							backgroundColor: [
								"rgba(75, 192, 192, 0.6)", // Цвет для "Показов"
								"rgba(255, 99, 132, 0.6)", // Цвет для "Расходов"
								"rgba(54, 162, 235, 0.6)", // Цвет для "Кликов"
							],
							borderColor: [
								"rgba(75, 192, 192, 1)", // Цвет обводки для "Показов"
								"rgba(255, 99, 132, 1)", // Цвет обводки для "Расходов"
								"rgba(54, 162, 235, 1)", // Цвет обводки для "Кликов"
							],
							borderWidth: 1,
						},
					],
				},
			}
		})

	return (
		<div className='text-center'>
			<div className='flex flex-wrap gap-10'>
				{individualCharts.map(({ title, data }) => (
					<div key={title} className='w-[250px] h-[250px] text-center'>
						<h4 className='mb-[10px] text-[14px]'>{title}</h4>
						<div className='w-full h-full'>
							<Doughnut
								data={data}
								options={{
									maintainAspectRatio: false,
									plugins: {
										legend: {
											position: "bottom",
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
