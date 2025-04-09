import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { adsStore } from '../ads/ads.store'
import { campaingsStore } from '../campaing/campaings.store'
import { groupStore } from '../group/group.store'
import { Account, BaseStore } from '../types'

export const accountStore = create<BaseStore<Account>>()(
  persist(
    (set) => ({
      items: [],
      selectedItems: [],
      searchQuery: "",
      sortKey: 'username',
      sortOrder: "asc",
      isLoading: true,
      
      setItems: (item) => set({items: item, isLoading: false }),

      addItem: (item: Account) =>
                set((state) => ({
                  items: [...state.items, item],
                })),

      updateItem: (name: string, updatedData: Partial<Account>) =>
        set((state) => ({
          items: state.items.map((account) =>
            account.username === name ? { ...account, ...updatedData } : account
          ),
        })),
      
      toggleItemSelection: (username) =>
        set((state) => ({
          selectedItems: state.selectedItems.includes(username)
            ? state.selectedItems.filter((name) => name !== username)
            : [...state.selectedItems, username],
        })),
      
        toggleAllSelection: () =>
        set((state) => ({
          selectedItems:
            state.selectedItems.length === state.items.length
              ? []
              : state.items.map((account) => account.username),
        })),
        unselectAll: () => set({ selectedItems: [] }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setSortKey: (key) =>
        set((state) => ({
          sortKey: key,
          sortOrder: state.sortKey === key && state.sortOrder === 'asc' ? 'desc' : 'asc',
        })),
      
      deleteSelectedItems: () =>
        set((state) => {
          const usernamesToDelete = state.selectedItems;
      
          const newAccounts = state.items.filter(
            (account) => !usernamesToDelete.includes(account.username)
          );
      
          campaingsStore.setState((cState) => {
            const updatedCampaigns = cState.items
              .map((campaign) => ({
                ...campaign,
                createdBy: campaign.createdBy.filter(
                  (creator) => !usernamesToDelete.includes(creator)
                ),
              }))
              .filter((campaign) => campaign.createdBy.length > 0);
      
            return { items: updatedCampaigns };
          });
      
          const activeCampaigns = campaingsStore.getState().items.map((c) => c.name);
      
          groupStore.setState((gState) => {
            const updatedGroups = gState.items
              .map((group) => ({
                ...group,
                campaigns: group.campaigns.filter(
                  (campaign) => activeCampaigns.includes(campaign)
                ),
              }))
              .filter((group) => group.campaigns.length > 0);
      
            return { items: updatedGroups };
          });
      
          const activeGroups = groupStore.getState().items.map((g) => g.name);
      
          // Обновляем рекламу
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
            items: newAccounts,
            selectedItems: [],
          };
        }),
      
        reset: () => 
        set({
          items: [],
          selectedItems: [],
          searchQuery: '',
          isLoading: false
        })
      }),
    {
      name: 'account-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        selectedItems: state.selectedItems,
        searchQuery: state.searchQuery,
        sortKey: state.sortKey,
        sortOrder: state.sortOrder
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setItems(state.items);
        }
      },
    }
  )
)