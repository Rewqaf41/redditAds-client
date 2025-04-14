"use client"

// Импортируем необходимые хранилища для работы с аккаунтами, кампаниями, группами и рекламами
import { accountStore } from "@/store/account/account.store"
import { adsStore } from "@/store/ads/ads.store"
import { campaingsStore } from "@/store/campaing/campaings.store"
import { groupStore } from "@/store/group/group.store"
import { MetricsType } from "@/store/types"
import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Title,
	Tooltip,
} from "chart.js"
import { useMemo } from "react"
import { Bar } from "react-chartjs-2"

// Регистрируем необходимые компоненты для работы с графиками в Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function HorizontalBarChart() {
	// Получаем данные аккаунтов, выбранных аккаунтов, кампаний, выбранных кампаний, групп и выбранных групп из состояния
	const { items: accounts, selectedItems: selectedAccounts } = accountStore()
	const { items: campaigns, selectedItems: selectedCampaigns } =
		campaingsStore()
	const { items: groups, selectedItems: selectedGroups } = groupStore()
	const { items: ads, selectedItems: selectedAds } = adsStore()

	// Функция для вычисления метрик (показов, расходов и идеальных показов)
	const calculateMetrics = (metrics: MetricsType[]) => {
		// Суммируем все показы и расходы
		const impressions = metrics.reduce(
			(sum, m) => sum + (Number(m.impressions) || 0),
			0
		)
		const spend = metrics.reduce((sum, m) => sum + (Number(m.spend) || 0), 0)
		// Идеальные показы вычисляются как расход * 10
		const idealImpressions = spend * 10
		return { impressions, spend, idealImpressions }
	}

	// Используем useMemo для оптимизации расчётов и предотвращения лишних перерисовок
	const { labels, spendData, impressionsData, idealImpressionsData, maxValue } =
		useMemo(() => {
			// Массив для хранения данных
			let items: { name: string; metrics: MetricsType[] }[] = []

			// Объединяем данные для аккаунтов, кампаний, групп и реклам
			items = [
				...items,
				...accounts
					.filter((account) => selectedAccounts.includes(account.username))
					.map((account) => ({
						name: `Аккаунт: ${account.username}`,
						metrics: account.metrics || [],
					})),
				...campaigns
					.filter((campaign) => selectedCampaigns.includes(campaign.name))
					.map((campaign) => ({
						name: `Кампания: ${campaign.name}`,
						metrics: campaign.metrics || [],
					})),
				...groups
					.filter((group) => selectedGroups.includes(group.name))
					.map((group) => ({
						name: `Группа: ${group.name}`,
						metrics: group.metrics || [],
					})),
				...ads
					.filter((ad) => selectedAds.includes(ad.name))
					.map((ad) => ({
						name: `Реклама: ${ad.name}`,
						metrics: ad.metrics || [],
					})),
			]

			// Фильтруем данные, чтобы оставить только те, у которых есть метрики
			items = items.filter(({ metrics }) => {
				const { impressions, spend, idealImpressions } =
					calculateMetrics(metrics)
				return impressions > 0 || spend > 0 || idealImpressions > 0
			})

			// Создаём метки для графика, обрезая длинные имена
			const labels = items.map((item) =>
				item.name.length > 15 ? `${item.name.slice(0, 15)}...` : item.name
			)

			// Массивы для хранения данных о расходах, показах и идеальных показах
			const spendData: number[] = []
			const impressionsData: number[] = []
			const idealImpressionsData: number[] = []

			// Заполняем массивы данными
			items.forEach((item) => {
				const { impressions, spend, idealImpressions } = calculateMetrics(
					item.metrics
				)
				impressionsData.push(impressions)
				spendData.push(spend)
				idealImpressionsData.push(idealImpressions)
			})

			// Находим максимальное значение для шкалы
			const max = Math.max(
				...spendData,
				...impressionsData,
				...idealImpressionsData
			)

			// Возвращаем данные для использования в графике
			return {
				labels,
				spendData,
				impressionsData,
				idealImpressionsData,
				maxValue: max,
			}
		}, [
			selectedAccounts,
			selectedCampaigns,
			selectedGroups,
			selectedAds,
			accounts,
			campaigns,
			groups,
			ads,
		])

	// Опции для настройки графика (Chart.js)
	const options = {
		indexAxis: "y" as const, // Оси графика будут горизонтальными
		responsive: true, // График будет адаптироваться к размеру экрана
		plugins: {
			legend: {
				position: "top" as const, // Позиция легенды вверху
			},
			title: {
				display: true,
				text: "Метрики: Расхода, Показов и Идеального кол-ва показов", // Заголовок графика
			},
			tooltip: {
				callbacks: {
					// Настройка подсказки при наведении на элементы графика
					label: function (context: any) {
						const value = context.raw
						return `${context.dataset.label}: ${value}` // Показать значение
					},
				},
			},
		},
		scales: {
			x: {
				stacked: false, // Не используем накопительный график
				min: 0, // Минимальное значение на оси X
				max: maxValue * 1.1, // Максимальное значение на оси X с добавлением 10%
				ticks: {
					stepSize: 500, // Шаг между метками на оси X
				},
			},
			y: {
				stacked: false, // Не используем накопительный график
			},
		},
	}

	// Данные для графика
	const chartData = {
		labels, // Метки для графика
		datasets: [
			{
				label: "Идеальное кол-во показов", // Подпись для первого набора данных
				data: idealImpressionsData,
				backgroundColor: "rgba(255, 206, 86, 0.5)", // Цвет фона для столбца
				borderColor: "rgba(255, 206, 86, 1)", // Цвет обводки
				borderWidth: 1,
				order: 1, // Порядок отображения
				barPercentage: 0.4,
				categoryPercentage: 0.8,
				minBarLength: 5, // Минимальная длина столбца
			},
			{
				label: "Показы", // Подпись для второго набора данных
				data: impressionsData,
				backgroundColor: "rgba(0, 255, 255, 0.5)", // Цвет фона для столбца
				borderColor: "rgba(0, 255, 255, 1)", // Цвет обводки
				borderWidth: 1,
				order: 2, // Порядок отображения
				barPercentage: 0.4,
				categoryPercentage: 0.8,
				minBarLength: 5, // Минимальная длина столбца
			},
			{
				label: "Затраты", // Подпись для третьего набора данных
				data: spendData,
				backgroundColor: "rgba(255, 99, 132, 0.5)", // Цвет фона для столбца
				borderColor: "rgba(255, 99, 132, 1)", // Цвет обводки
				borderWidth: 1,
				order: 3, // Порядок отображения
				barPercentage: 0.4,
				categoryPercentage: 0.8,
				minBarLength: 5, // Минимальная длина столбца
			},
		],
	}

	return (
		<div className='w-full'>
			<Bar options={options} data={chartData} />
		</div>
	)
}
