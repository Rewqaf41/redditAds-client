// export interface IRedditApi {
// 	usernames: string[]
// 	payload?: any
// }
// export interface IRedditApiResponeItem {
// 	usernames: string
// 	raw?: IGetMeResponseBody
// }

export interface IGetAccountData {
	usernames: string[]
}

export interface IRawAccountData {
	data: {
			id: string;
			reddit_user_id: string;
			firstname: string;
			lastname: string;
			email: string | null;
			phone: string;
			reddit_username: string;
	};
}

export interface IAccountInfo {
	username: string;
	raw: string;
	parsedRaw?: IRawAccountData;
}

export interface IGetAccountsResponse {
	accounts: IAccountInfo[];
}