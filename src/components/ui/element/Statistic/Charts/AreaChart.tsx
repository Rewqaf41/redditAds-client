"use client"

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
	const { items: accounts, selectedItems: selectedAccounts } = accountStore()
	const { items: campaigns, selectedItems: selectedCampaigns } =
		campaingsStore()
	const { items: groups, selectedItems: selectedGroups } = groupStore()
	const { items: ads, selectedItems: selectedAds } = adsStore()

	const allSelectedItems = useMemo(() => {
		return [
			...accounts
				.filter((account) => selectedAccounts.includes(account.username))
				.map((account) => ({
					type: "Аккаунт",
					name: account.username,
					metrics: account.metrics || [],
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

	const calculateMetrics = (metrics: MetricsType[]) => {
		const ecpm = metrics.reduce((sum, m) => sum + (Number(m.ecpm) || 0), 0)
		const cpc = metrics.reduce((sum, m) => sum + (Number(m.cpc) || 0), 0)
		const ctr = metrics.reduce((sum, m) => sum + (Number(m.ctr) || 0), 0)

		return [ecpm, cpc, ctr]
	}

	const individualCharts = allSelectedItems
		.filter(({ metrics }) => {
			const [ecpm, cpc, ctr] = calculateMetrics(metrics)
			return ecpm > 0 || cpc > 0 || ctr > 0
		})
		.map(({ type, name, metrics }) => {
			const individualMetricsData = calculateMetrics(metrics)
			const individualLabels = ["ECPM", "CPC", "CTR"]

			return {
				title: `${type}: ${name}`,
				data: {
					labels: individualLabels,
					datasets: [
						{
							label: "Метрики",
							data: individualMetricsData,
							backgroundColor: "rgba(64, 193, 150, 0.2)",
							borderColor: "rgba(64, 193, 150, 1)",
							borderWidth: 2,
							fill: true,
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
									maintainAspectRatio: false,
									plugins: {
										legend: {
											position: "top",
										},
									},
									scales: {
										x: {
											grid: {
												display: false,
											},
										},
										y: {
											beginAtZero: true,
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
