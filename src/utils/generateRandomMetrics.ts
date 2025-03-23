export function generateRandomMetrics (spend?: string) {
	return {
		impressions: (Math.floor(Math.random() * 10000) + 5000).toString(),
		spend: spend ? spend.toString() : (Math.floor(Math.random() * 1000) + 10).toString(),
		clicks: (Math.floor(Math.random() * 1000) + 100).toString(),
		ecpm: (Math.random() * 10 + 5).toFixed(2),
		cpc: (Math.random() * 2 + 0.5).toFixed(2),
		ctr: (Math.random() * 0.4 + 0.1).toFixed(2),
	}
}
