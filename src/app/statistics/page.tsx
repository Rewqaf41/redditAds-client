import type { Metadata } from "next"

import { Statistic } from "@/components/ui/element/Statistic/Statistic"
import { NO_INDEX_PAGE } from "@/constants/seo.constants"

export const metadata: Metadata = {
	title: "Статистика",
	...NO_INDEX_PAGE,
}

export default function StatisticsPage() {
	return <Statistic />
}
