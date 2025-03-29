import { MetricsType } from "@/store/types"
import { useMemo } from "react"

function getNumericValue(value: string) {
	const cleanedValue = value.replace(/[^0-9.]/g, "")
	return parseFloat(cleanedValue) || 0
}

export function useFilteredAndSortedItems<T extends { name: string; metrics?: MetricsType[] }>(
	items: T[],
	searchQuery: string,
	sortKey: string,
	sortOrder: "asc" | "desc"
) {
	return useMemo(() => {
		const filteredItems = items.filter((item) =>
			item.name.toLowerCase().includes(searchQuery.toLowerCase())
		)

		const sortedItems = [...filteredItems].sort((a, b) => {
			if (sortKey === "name") {
				return sortOrder === "asc"
					? a.name.localeCompare(b.name)
					: b.name.localeCompare(a.name)
			}

			const key = sortKey as keyof MetricsType
			const valueA = getNumericValue(a.metrics?.[0]?.[key] || "")
			const valueB = getNumericValue(b.metrics?.[0]?.[key] || "")

			return sortOrder === "asc" ? valueA - valueB : valueB - valueA
		})

		return sortedItems
	}, [items, searchQuery, sortKey, sortOrder])
}
