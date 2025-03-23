import type { Metadata } from "next"

import { Accounts } from "@/components/ui/element/Accounts/Accounts"
import { NO_INDEX_PAGE } from "@/constants/seo.constants"

export const metadata: Metadata = {
	title: "Аккаунты",
	...NO_INDEX_PAGE,
}

export default function AccountPage() {
	return <Accounts />
}
