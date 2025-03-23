import { instance } from "@/api/axiosRedditApi"
import { IAccountData, IAccountInfo, IAdData, ICampingData, ICommonRequest, IGetAccountsResponse, IGroupData, IRawAccountData } from '@/types/reddit/redditApi.types'
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
	async getAccountsInfo(data: IAccountData): Promise<IGetAccountsResponse> {
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

	async CreateCamping(usernames: string[], data: ICampingData) {
		const token = getAccessToken()
		const response = await instance.post<ICommonRequest>("ПОМЕНЯТЬ ССЫЛКУ НА ПРАВИЛЬНУЮ", 
			{
				"usernames": usernames,
				"rp": {
					"name": data.name,
					"configured_status": "ACTIVE",
					"objective": data.objective,
					"spend_cap": data.spend_cap
				}
			}, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
		return response
	}

	async CreateGroup(usernames: string[], data: IGroupData) {
		const token = getAccessToken()
		const response = await instance.post<ICommonRequest>("ПОМЕНЯТЬ ССЫЛКУ НА ПРАВИЛЬНУЮ",
			// TODO: ЗАПОЛНИТ ЭТУ ПОЕБОТУ😭
			{
				"usernames": usernames,
				"rp": {
					"bid_strategy": null,
					"bid_type": null,
					"campaign_id": "...",
					"configured_status": "ACTIVE",
					"end_time": data.end_time,
					"goal_type": data.goal_type,
					"goal_value": data.goal_value,
					 "name": data.name,
					 "start_time": data.start_time,
					 "targeting": {
						"carriers": data.carriers,
						"communities": convertToArray(data.communities),
						"devices": data.devices
					 }
				}
			},
			{
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
	)
	return response
}

	async CreateAds(usernames: string[] , data: IAdData) {
		const token = getAccessToken()
		const response = await instance.post<ICommonRequest>("ПОМЕНЯТЬ ССЫЛКУ НА ПРАВИЛЬНУЮ",
			{
				"usernames": usernames,
				"rp": {
					"type": "UNSPECIFIED",
					"click_url": data.destination_url,
					"configured_status": "ACTIVE",
					"name": data.name,
					"preview_expiry": new Date().toISOString(),
					"shopping_creative": {
						"allow_comments": data.allow_comments,
						"call_to_action": data.call_to_action,
						"destination_url": data.destination_url,
						"headline": data.headline
					},
				}
			},
			{
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		)
		return response
	}

}

function convertToArray(data: string | undefined): string[]	| undefined {
	if (!data) return
	return data.split(/[,\s]+/)
	.map((word: string) => word.trim())
	.filter((word: string) => word.length > 0)
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