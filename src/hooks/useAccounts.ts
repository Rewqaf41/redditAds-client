import RedditAccount from "@/services/reddit/redditAccount.service"
import redditApiService from '@/services/reddit/redditApi.service'
import { useQuery } from "@tanstack/react-query"

/**
 * Хук `useAccounts` используется для получения списка аккаунтов Reddit и их информации.
 * Он делает два запроса:
 * 1. Получает список имён пользователей (usernames).
 * 2. На основе этих имён запрашивает детальную информацию о каждом аккаунте (ids).
 * 
 * Второй запрос выполняется только если данные из первого уже получены,
 * и повторяется каждые 5 минут (рефреш).
 *
 * @returns объект с двумя полями:
 * - `usernames`: список имён пользователей
 * - `ids`: массив информации об аккаунтах (из второго запроса)
 */
export function useAccounts() {
	// Первый запрос: получаем список usernames
	const usernames = useQuery({
		queryKey: ["accounts"],
		queryFn: () => RedditAccount.getAccounts(), // функция-запрос
	}).data

	// Второй запрос: получаем подробности по usernames
	const ids = useQuery({
		queryKey: ["ids"],
		queryFn: () => redditApiService.getAccountsInfo({ usernames: usernames?.data }), // usernames из первого запроса
		enabled: !!usernames?.data, // запрос включается только если есть usernames
		refetchInterval: 60000 * 5, // автообновление раз в 5 минут
	}).data

	// Возвращаем подготовленные данные
	return { 
		usernames: usernames?.data, 
		ids: ids?.accounts 
	}
}
