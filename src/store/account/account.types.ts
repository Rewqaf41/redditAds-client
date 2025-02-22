export interface AccountStore {
  selectedAccounts: string[]
  toggleAccountSelection: (username: string) => void
  toggleAllSelection: (selectAll: boolean) => void
}