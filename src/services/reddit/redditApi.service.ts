import { instance } from "@/api/axiosRedditApi"
import { IAccountInfo, IGetAccountData, IGetAccountsResponse, IRawAccountData } from '@/types/reddit/redditApi.types'
import { getAccessToken } from '../auth/auth.helper'


// function commonRequest(usernames: string[], payload: any, method: string, url: string) {
// 	if (method == "get") {
// 		axios.get(url, {
// 			data: {
// 				"usernames": usernames,
// 				"rp": payload
// 			}
// 		})
// 	}
// }

class RedditApiService {
	async getAccountsInfo(data: IGetAccountData): Promise<IGetAccountsResponse> {
		const token = getAccessToken()
		const response = await instance.post(
			"/me",
			data,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'X-HTTP-Method-Override': 'GET'
				}
			}
		)
		const accounts: IAccountInfo[] = response.data.map((account: any) => ({
			username: account.username,
			...safeParseRaw(account.raw)
	}));

	return { accounts };
	}

	async getMetrics(): Promise<any> {
		const token = getAccessToken()
		const response = await instance.post(`/metrics`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
		return response.data
	}
}

function safeParseRaw(raw: string): IRawAccountData | undefined {
	try {
			return JSON.parse(raw) as IRawAccountData;
	} catch (error) {
			console.error("Error parsing raw account data:", error);
			return undefined;
	}
}


const redditApiService = new RedditApiService()
export default redditApiService