"use client"

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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function HorizontalBarChart() {
	const { items: accounts, selectedItems: selectedAccounts } = accountStore()
	const { items: campaigns, selectedItems: selectedCampaigns } =
		campaingsStore()
	const { items: groups, selectedItems: selectedGroups } = groupStore()
	const { items: ads, selectedItems: selectedAds } = adsStore()

	const calculateMetrics = (metrics: MetricsType[]) => {
		const impressions = metrics.reduce(
			(sum, m) => sum + (Number(m.impressions) || 0),
			0
		)
		const spend = metrics.reduce((sum, m) => sum + (Number(m.spend) || 0), 0)
		const idealImpressions = spend * 10
		return { impressions, spend, idealImpressions }
	}

	const { labels, spendData, impressionsData, idealImpressionsData, maxValue } =
		useMemo(() => {
			let items: { name: string; metrics: MetricsType[] }[] = []

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

			items = items.filter(({ metrics }) => {
				const { impressions, spend, idealImpressions } =
					calculateMetrics(metrics)
				return impressions > 0 || spend > 0 || idealImpressions > 0
			})

			const labels = items.map((item) =>
				item.name.length > 15 ? `${item.name.slice(0, 15)}...` : item.name
			)

			const spendData: number[] = []
			const impressionsData: number[] = []
			const idealImpressionsData: number[] = []

			items.forEach((item) => {
				const { impressions, spend, idealImpressions } = calculateMetrics(
					item.metrics
				)
				impressionsData.push(impressions)
				spendData.push(spend)
				idealImpressionsData.push(idealImpressions)
			})

			const max = Math.max(
				...spendData,
				...impressionsData,
				...idealImpressionsData
			)

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

	const options = {
		indexAxis: "y" as const,
		responsive: true,
		plugins: {
			legend: {
				position: "top" as const,
			},
			title: {
				display: true,
				text: "Метрики: Расхода, Показов и Идеального кол-ва показов",
			},
			tooltip: {
				callbacks: {
					label: function (context: any) {
						const value = context.raw
						return `${context.dataset.label}: ${value}`
					},
				},
			},
		},
		scales: {
			x: {
				stacked: false,
				min: 0,
				max: maxValue * 1.1,
				ticks: {
					stepSize: 500,
				},
			},
			y: {
				stacked: false,
			},
		},
	}

	const chartData = {
		labels,
		datasets: [
			{
				label: "Идеальное кол-во показов",
				data: idealImpressionsData,
				backgroundColor: "rgba(255, 206, 86, 0.5)",
				borderColor: "rgba(255, 206, 86, 1)",
				borderWidth: 1,
				order: 1,
				barPercentage: 0.4,
				categoryPercentage: 0.8,
				minBarLength: 5,
			},
			{
				label: "Показы",
				data: impressionsData,
				backgroundColor: "rgba(0, 255, 255, 0.5)",
				borderColor: "rgba(0, 255, 255, 1)",
				borderWidth: 1,
				order: 2,
				barPercentage: 0.4,
				categoryPercentage: 0.8,
				minBarLength: 5,
			},
			{
				label: "Затраты",
				data: spendData,
				backgroundColor: "rgba(255, 99, 132, 0.5)",
				borderColor: "rgba(255, 99, 132, 1)",
				borderWidth: 1,
				order: 3,
				barPercentage: 0.4,
				categoryPercentage: 0.8,
				minBarLength: 5,
			},
		],
	}

	return (
		<div className='w-full'>
			<Bar options={options} data={chartData} />
		</div>
	)
}
