import RedditAccount from "@/services/reddit/redditAccount.service"
import redditApiService from '@/services/reddit/redditApi.service'
import { useQuery } from "@tanstack/react-query"

export function useAccounts() {
	const usernames = useQuery({
		queryKey: ["accounts"],
		queryFn: () => RedditAccount.getAccounts(),
	}).data


	const ids = useQuery({
		queryKey: ["ids"],
		queryFn: () => redditApiService.getAccountsInfo({usernames: usernames?.data}),
		enabled: !!usernames?.data,
		refetchInterval: 60000*5
	}).data

	return { usernames: usernames?.data, ids: ids?.accounts }
}