export interface LLMStore {
	baseUrl: string
	model: string
	setBaseUrl: (url: string) => void
	setModel: (model: string) => void
}
