import type { Metadata } from "next"

import { Groups } from "@/components/ui/element/Group/Group"
import { NO_INDEX_PAGE } from "@/constants/seo.constants"

export const metadata: Metadata = {
	title: "",
	...NO_INDEX_PAGE,
}

export default function Page() {
	return <Groups />
}
