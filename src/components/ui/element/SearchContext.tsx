"use client"
import { BaseStore } from "@/store/types"
import { createContext, ReactNode, useContext } from "react"
import { StoreApi, UseBoundStore } from "zustand"

interface SearchContextValue {
	searchQuery: string
	setSearchQuery: (query: string) => void
	selectedItems: string[]
	deleteSelectedItems: () => void
}

const SearchContext = createContext<SearchContextValue>({
	searchQuery: "",
	setSearchQuery: () => {},
	selectedItems: [],
	deleteSelectedItems: () => {},
})

export function SearchProvider<T>({
	children,
	store,
}: {
	children: ReactNode
	store: UseBoundStore<StoreApi<BaseStore<T>>>
}) {
	const { searchQuery, setSearchQuery, selectedItems, deleteSelectedItems } =
		store()

	const value = {
		searchQuery,
		setSearchQuery,
		selectedItems,
		deleteSelectedItems,
	}

	return (
		<SearchContext.Provider value={value}>{children}</SearchContext.Provider>
	)
}

export const useSearchContext = () => useContext(SearchContext)
