import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { BaseStore, Campaing } from "../types"

export const campaingsStore = create<BaseStore<Campaing>>()(
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
          items: items.map((campaing) => ({
            ...campaing,
            createdBy: campaing.createdBy || [],
          })),
          isLoading: false,
        }),

        addItem: (item: Campaing) =>
          set((state) => ({
            items: [...state.items, item],
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
              : state.items.map((campaing) => campaing.name),
        })),

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
            (campaing) => !state.selectedItems.includes(campaing.name)
          ),
          selectedItems: [],
        })),

      addCreatorToCampaign: (campaignName: string, username: string) =>
        set((state) => ({
          items: state.items.map((campaing) =>
            campaing.name === campaignName
              ? {
                  ...campaing,
                  createdBy: campaing.createdBy.includes(username)
                    ? campaing.createdBy
                    : [...campaing.createdBy, username],
                }
              : campaing
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
      name: "campaings-storage",
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
