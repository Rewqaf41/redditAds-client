import { instance } from '@/api/axiosRedditAccount'
import { IFormRedditAccount } from '@/types/auth/auth.types'
import { getAccessToken } from '../auth/auth.helper'

class RedditAccountService {
	async addAccount(data: IFormRedditAccount) {
		const token = getAccessToken()
		const response = await instance.post(
			`/add-account`,
			data,
			{
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		)
		return response
	}

	async getAccounts() {
		const token = getAccessToken()
		const response = await instance.get(`/accounts`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
		return response
	}
}

const redditAccountService = new RedditAccountService()
export default redditAccountService