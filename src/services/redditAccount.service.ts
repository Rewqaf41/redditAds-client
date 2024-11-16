import { instance } from '@/api/axiosRedditAccount'
import { IFormRedditAccount } from '@/types/auth.types'

class RedditAccount {
	async addAccount(data: IFormRedditAccount) {
		const response = await instance.post(
			`/add-account`,
			data
		)
		return response
	}
}

export default new RedditAccount()