export interface ICommonRequest {
	usernames: IAccountData
	rp: any
}

export interface ICampingData {
	name: string
	objective: string
	spend_cap: string
}

export interface IGroupData {
	name: string
	keywords?: string
	communities?: string
	interests?: string
	geolocations?: string
	excluded_geolocations?: string
	gender: string | null
	devices: string | null

	ios_devices?: string[]
	android_devices?: string[]
	carriers?: string[]

	excluded_communities?: string
	excluded_keywords?: string
	goal_value: string
	goal_type: string
	start_time: string | null
	end_time?: string | null

	campaings: string[]
}

export interface IAdData {
  name: string
  headline: string
  destination_url: string
  call_to_action: string
  allow_comments: boolean

	groups: string[]
}

export interface IAccountData {
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