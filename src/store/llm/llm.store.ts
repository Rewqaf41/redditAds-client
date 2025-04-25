import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { LLMStore } from './llm.types'


export const llmStore = create(
	persist<LLMStore>(
		(set) => ({
			baseUrl: '',
			model: 'gemma-3-4b',
			setBaseUrl: (url) =>
				set({ baseUrl: url.endsWith('/') ? url.slice(0, -1) : url }),
			setModel: (model) => set({ model }),
		}),
		{
			name: 'llm-config',
			storage: createJSONStorage(() => localStorage),
		}
	)
)
