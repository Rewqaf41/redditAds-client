export interface BaseStore<T> {
  items: T[];
  selectedItems: string[];
  searchQuery: string;
  sortKey: string;
  sortOrder: 'asc' | 'desc';
  isLoading: boolean;
  setItems: (items: T[]) => void;
  addItem: (item: T) => void;
  toggleItemSelection: (id: string) => void;
  toggleAllSelection: () => void;
  setSearchQuery: (query: string) => void;
  setSortKey: (key: string) => void;
  deleteSelectedItems: () => void;
  reset: () => void;
}

export interface Account {
	username: string
	status: string
	metrics: MetricsType[]
}

export interface Campaing {
	name: string;
	status: string;
	metrics: MetricsType[];
  createdBy: string[];
}

export interface Group {
  name: string;
  status: string;
  metrics: MetricsType[];
  campaigns: string[];
}

export interface Ad {
  name: string;
  status: string;
  metrics: MetricsType[];
  groups: string[];
}

export interface MetricsType {
  impressions: string
  spend: string
  clicks: string
  ecpm: string
  cpc: string
  ctr: string
}