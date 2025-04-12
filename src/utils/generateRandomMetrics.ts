export function generateRandomMetrics(spend_cap?: string) {
	const maxSpend = spend_cap ? parseFloat(spend_cap.replace(/\$/g, "").trim()) : 1000
	const randomSpend = (Math.random() * maxSpend).toFixed(0)

	return {
		impressions: (Math.floor(Math.random() * 10000) + 5000).toString(),
		spend: randomSpend,
		clicks: (Math.floor(Math.random() * 1000) + 100).toString(),
		ecpm: Math.random().toFixed(2),
		cpc: Math.random().toFixed(2),
		ctr: Math.random().toFixed(2),
	}
}