"use client"

import LayoutClient from "@/components/layout/layout"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { PropsWithChildren, useState } from "react"

export function Providers({ children }: PropsWithChildren<unknown>) {
	const [client] = useState(new QueryClient())

	return (
		<QueryClientProvider client={client}>
			<LayoutClient>{children}</LayoutClient>
		</QueryClientProvider>
	)
}
