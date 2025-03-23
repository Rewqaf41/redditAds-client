import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import rawData from '../../components/ui/element/Accounts/account.json'
import { Account, BaseStore } from '../types'

export const accountStore = create<BaseStore<Account>>()(
  persist(
    (set, get) => ({
      items: rawData.accounts,
      selectedItems: [],
      searchQuery: '',
      sortKey: 'username',
      sortOrder: 'asc',
      isLoading: true,
      
      setItems: (items) => set({ items, isLoading: false }),

      addItem: (item: Account) =>
                set((state) => ({
                  items: [...state.items, item],
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
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setSortKey: (key) =>
        set((state) => ({
          sortKey: key,
          sortOrder: state.sortKey === key && state.sortOrder === 'asc' ? 'desc' : 'asc',
        })),
      
        deleteSelectedItems: () =>
        set((state) => ({
          items: state.items.filter(
            (account) => !state.selectedItems.includes(account.username)
          ),
          selectedAccounts: [],
        })),
      
        reset: () => 
        set({
          items: rawData.accounts,
          selectedItems: [],
          searchQuery: '',
          isLoading: false
        })
    }),
    {
      name: 'account-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accounts: state.items,
        selectedAccounts: state.selectedItems,
        searchQuery: state.searchQuery,
        sortKey: state.sortKey,
        sortOrder: state.sortOrder
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setItems(state.items)
        }
      }
    }
  )
)