import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { Ad, BaseStore } from '../types'

export const adsStore = create<BaseStore<Ad>>()(
	persist(
		(set) => ({
			items: [],
			selectedItems: [],
			searchQuery: "",
			sortKey: "name",
			sortOrder: "asc",
			isLoading: true,

			setItems: (items) =>
				set({
					items: items.map((ad) => ({
						...ad,
						groups: ad.groups || [],
					})),
					isLoading: false,
				}),

			addItem: (item: Ad) =>
				set((state) => ({
					items: [...state.items, item],
				})),

				updateItem: (name: string, updatedData: Partial<Ad>) =>
					set((state) => ({
						items: state.items.map((ad) =>
							ad.name === name ? { ...ad, ...updatedData } : ad
						),
					})),

			toggleItemSelection: (name) =>
				set((state) => ({
					selectedItems: state.selectedItems.includes(name)
						? state.selectedItems.filter((item) => item !== name)
						: [...state.selectedItems, name],
				})),

			toggleAllSelection: () =>
				set((state) => ({
					selectedItems:
						state.selectedItems.length === state.items.length
							? []
							: state.items.map((ad) => ad.name),
				})),
				unselectAll: () => set({ selectedItems: [] }),

			setSearchQuery: (query) => set({ searchQuery: query }),

			setSortKey: (key) =>
				set((state) => ({
					sortKey: key,
					sortOrder:
						state.sortKey === key && state.sortOrder === "asc" ? "desc" : "asc",
				})),

			deleteSelectedItems: () =>
				set((state) => ({
					items: state.items.filter(
						(group) => !state.selectedItems.includes(group.name)
					),
					selectedItems: [],
				})),

			addCampaignToGroup: (adsName: string, groupsName: string) =>
				set((state) => ({
					items: state.items.map((ad) =>
						ad.name === adsName
							? {
									...ad,
									groups: ad.groups.includes(groupsName)
										? ad.groups
										: [...ad.groups, groupsName],
								}
							: ad
					),
				})),

			reset: () =>
				set({
					items: [],
					selectedItems: [],
					searchQuery: "",
					sortKey: "name",
					sortOrder: "asc",
					isLoading: false,
				}),
		}),
		{
			name: "ads-storage",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				items: state.items,
				selectedItems: state.selectedItems,
				searchQuery: state.searchQuery,
				sortKey: state.sortKey,
				sortOrder: state.sortOrder,
			}),
			onRehydrateStorage: () => (state) => {
				if (state) {
					state.setItems(state.items);
				}
			},
		}
	)
);
