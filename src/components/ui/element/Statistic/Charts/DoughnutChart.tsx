"use client"

import { accountStore } from "@/store/account/account.store"
import { adsStore } from "@/store/ads/ads.store"
import { campaingsStore } from "@/store/campaing/campaings.store"
import { groupStore } from "@/store/group/group.store"
import { MetricsType } from "@/store/types"
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js"
import { useMemo } from "react"
import { Doughnut } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

export function DoughnutChart() {
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
		const impressions = metrics.reduce(
			(sum, m) => sum + (Number(m.impressions) || 0),
			0
		)
		const spend = metrics.reduce((sum, m) => sum + (Number(m.spend) || 0), 0)
		const clicks = metrics.reduce((sum, m) => sum + (Number(m.clicks) || 0), 0)

		return [impressions, spend, clicks]
	}

	const individualCharts = allSelectedItems
		.filter(({ metrics }) => {
			const [impressions, spend, clicks] = calculateMetrics(metrics)
			return impressions > 0 || spend > 0 || clicks > 0
		})
		.map(({ type, name, metrics }) => {
			const individualMetricsData = calculateMetrics(metrics)
			const individualLabels = [
				`Показы (${individualMetricsData[0]})`,
				`Расход (${individualMetricsData[1]})`,
				`Клики (${individualMetricsData[2]})`,
			]

			return {
				title: `${type}: ${name}`,
				data: {
					labels: individualLabels,
					datasets: [
						{
							data: individualMetricsData,
							backgroundColor: [
								"rgba(75, 192, 192, 0.6)",
								"rgba(255, 99, 132, 0.6)",
								"rgba(54, 162, 235, 0.6)",
							],
							borderColor: [
								"rgba(75, 192, 192, 1)",
								"rgba(255, 99, 132, 1)",
								"rgba(54, 162, 235, 1)",
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
