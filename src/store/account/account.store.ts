import { create } from 'zustand'
import data from '../../components/ui/element/Accounts/account.json'
import { AccountStore } from './account.types'

export const accountStore = create<AccountStore>((set) => ({
  selectedAccounts: [],
  toggleAccountSelection: (username) => set((state) => {
    const selectedAccounts = state.selectedAccounts.includes(username)
      ? state.selectedAccounts.filter((account) => account !== username)
      : [...state.selectedAccounts, username]
    return { selectedAccounts }
  }),
  toggleAllSelection: (selectAll) => set(() => ({
    selectedAccounts: selectAll ? data.accounts.map((account) => account.username) : []
  }))
}))