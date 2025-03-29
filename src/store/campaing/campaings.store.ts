import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { adsStore } from '../ads/ads.store'
import { groupStore } from '../group/group.store'
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

      setItems: (item) => set({items: item, isLoading: false}),

        addItem: (item: Campaing) =>
          set((state) => ({
            items: [...state.items, item],
          })),

          updateItem: (name: string, updatedData: Partial<Campaing>) =>
            set((state) => ({
              items: state.items.map((campaing) =>
                campaing.name === name ? { ...campaing, ...updatedData } : campaing
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
        set((state) => {
          const campaignsToDelete = state.selectedItems;
      
          const newCampaigns = state.items.filter(
            (campaign) => !campaignsToDelete.includes(campaign.name)
          );
      
          groupStore.setState((gState) => {
            const updatedGroup = gState.items
              .map((group) => ({
                ...group,
                campaigns: group.campaigns.filter(
                  (campaign) => !campaignsToDelete.includes(campaign)
                ),
              }))
              .filter((group) => group.campaigns.length > 0);
      
            return { items: updatedGroup };
          });
          
          const activeGroups = groupStore.getState().items.map((g) => g.name);

        adsStore.setState((aState) => {
          const updatedAds = aState.items
            .map((ad) => ({
              ...ad,
              groups: ad.groups.filter((group) => activeGroups.includes(group)),
            }))
            .filter((ad) => ad.groups.length > 0);

          return { items: updatedAds };
        });
      
          return {
            items: newCampaigns,
            selectedItems: [],
          };
        }),

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
