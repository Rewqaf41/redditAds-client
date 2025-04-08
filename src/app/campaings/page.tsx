import type { Metadata } from "next"

import { Campaings } from "@/components/ui/element/Campaings/Campaings"
import { NO_INDEX_PAGE } from "@/constants/seo.constants"

export const metadata: Metadata = {
	title: "Кампании",
	...NO_INDEX_PAGE,
}

export default function CampaingsPage() {
	return <Campaings />
}
