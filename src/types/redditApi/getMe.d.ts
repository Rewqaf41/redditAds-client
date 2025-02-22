// Get Me
// Get https://ads-api.reddit.com/api/v3/me

interface IGetMeResponseBody {
	data: IDataGetMe
}

interface IDataGetMe {
	email: string
	firstname: string
	id: string
	lastname: string
	phone: string
	reddit_user_id: string
	reddit_username: string
}