import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { adsStore } from '../ads/ads.store'
import { BaseStore, Group } from '../types'

export const groupStore = create<BaseStore<Group>>()(
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
          items: items.map((group) => ({
            ...group,
            campaigns: group.campaigns || [],
          })),
          isLoading: false,
        }),

      addItem: (item: Group) =>
        set((state) => ({
          items: [...state.items, item],
        })),

        updateItem: (name: string, updatedData: Partial<Group>) =>
          set((state) => ({
            items: state.items.map((group) =>
              group.name === name ? { ...group, ...updatedData } : group
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
              : state.items.map((group) => group.name),
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
        set((state) => {
          const groupsToDelete = state.selectedItems;

          const newGroups = state.items.filter(
            (group) => !groupsToDelete.includes(group.name)
          );

          adsStore.setState((aState) => {
            const updatedGroup = aState.items
              .map((ad) => ({
                ...ad,
                groups: ad.groups.filter(
                  (group) => !groupsToDelete.includes(group)
                ),
              }))
              .filter((ad) => ad.groups.length > 0);
      
            return { items: updatedGroup };
          });
    
        return {
          items: newGroups,
          selectedItems: [],
        };
        }),

      addCampaignToGroup: (groupName: string, campaignName: string) =>
        set((state) => ({
          items: state.items.map((group) =>
            group.name === groupName
              ? {
                  ...group,
                  campaigns: group.campaigns.includes(campaignName)
                    ? group.campaigns
                    : [...group.campaigns, campaignName],
                }
              : group
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
      name: "groups-storage",
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
