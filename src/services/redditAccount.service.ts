import { instance } from '@/api/axiosRedditAccount'
import { IFormRedditAccount } from '@/types/auth.types'
import { getAccessToken } from './auth.helper'

class RedditAccount {
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
}

export default new RedditAccount()