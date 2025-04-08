import type { Metadata } from "next"

import { Ads } from "@/components/ui/element/Ads/Ads"
import { NO_INDEX_PAGE } from "@/constants/seo.constants"

export const metadata: Metadata = {
	title: "Рекламные объявления",
	...NO_INDEX_PAGE,
}

export default function AdsPage() {
	return <Ads />
}
