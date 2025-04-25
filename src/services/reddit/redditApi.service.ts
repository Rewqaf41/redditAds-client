import { instance } from "@/api/axiosRedditApi"
import { IAccountData, IAccountInfo, IAdData, ICampingData, ICommonRequest, IGetAccountsResponse, IGroupData, IRawAccountData } from '@/types/reddit/redditApi.types'
import { getAccessToken } from '../auth/auth.helper'

class RedditApiService {
  
  // Метод для получения информации о аккаунтах пользователя
  async getAccountsInfo(data: IAccountData): Promise<IGetAccountsResponse> {
    const token = getAccessToken() // Получаем токен авторизации
    const response = await instance.post(
      "/me",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Добавляем токен в заголовки запроса
          'X-HTTP-Method-Override': 'GET' // Указываем метод GET через заголовок
        }
      }
    )
    // Преобразуем данные аккаунтов из ответа и возвращаем
    const accounts: IAccountInfo[] = response.data.map((account: any) => ({
      username: account.username,
      ...safeParseRaw(account.raw) // Безопасно парсим необработанные данные
    }));

    return { accounts }; // Возвращаем информацию о аккаунтах
  }

  // Метод для получения метрик
  async getMetrics(): Promise<any> {
    const token = getAccessToken() // Получаем токен авторизации
    const response = await instance.post(`/metrics`, {
      headers: {
        Authorization: `Bearer ${token}` // Добавляем токен в заголовки запроса
      }
    })
    return response.data // Возвращаем данные метрик
  }

  // Метод для создания рекламной кампании
  async CreateCamping(usernames: string[], data: ICampingData) {
    const token = getAccessToken() // Получаем токен авторизации
    const response = await instance.post<ICommonRequest>("/campaigns", 
      {
        "usernames": usernames, // Передаем имена пользователей
        "rp": {
          "name": data.name,
          "configured_status": "ACTIVE", // Статус кампании
          "objective": data.objective, // Цель кампании
          "spend_cap": data.spend_cap // Лимит расходов
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Добавляем токен в заголовки запроса
        }
      }
    )
    return response // Возвращаем результат создания кампании
  }

  // Метод для создания рекламной группы
  async CreateGroup(usernames: string[], data: IGroupData) {
    const token = getAccessToken() // Получаем токен авторизации
    const response = await instance.post<ICommonRequest>("/ad_groups",
      {
        "usernames": usernames, // Передаем имена пользователей
        "rp": {
          "bid_strategy": null, // Не используется
          "bid_type": null, // Не используется
          "configured_status": "ACTIVE", // Статус группы
          "end_time": data.end_time, // Время окончания
          "goal_type": data.goal_type, // Тип цели
          "goal_value": data.goal_value, // Значение цели
          "name": data.name, // Имя группы
          "start_time": data.start_time, // Время начала
          "targeting": {
            "carriers": data.carriers, // Целевые операторы
            "communities": convertToArray(data.communities), // Целевые сообщества
            "devices": data.devices // Целевые устройства
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}` // Добавляем токен в заголовки запроса
        }
      }
    )
    return response // Возвращаем результат создания группы
  }

  // Метод для создания рекламного объявления
  async CreateAds(usernames: string[], data: IAdData) {
    const token = getAccessToken() // Получаем токен авторизации
    const response = await instance.post<ICommonRequest>("/ads",
      {
        "usernames": usernames, // Передаем имена пользователей
        "rp": {
          "type": "UNSPECIFIED", // Тип объявления
          "click_url": data.destination_url, // URL назначения
          "configured_status": "ACTIVE", // Статус объявления
          "name": data.name, // Имя объявления
          "preview_expiry": new Date().toISOString(), // Время истечения срока предварительного просмотра
          "shopping_creative": {
            "allow_comments": data.allow_comments, // Разрешение на комментарии
            "call_to_action": data.call_to_action, // Призыв к действию
            "destination_url": data.destination_url, // URL назначения
            "headline": data.headline // Заголовок
          },
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}` // Добавляем токен в заголовки запроса
        }
      }
    )
    return response // Возвращаем результат создания объявления
  }
}

// Функция для преобразования строки в массив, разделяя по пробелам и запятым
function convertToArray(data: string | undefined): string[] | undefined {
  if (!data) return // Если данных нет, возвращаем undefined
  return data.split(/[,\s]+/) // Разделяем строку на массив
    .map((word: string) => word.trim()) // Убираем пробелы по краям
    .filter((word: string) => word.length > 0) // Убираем пустые элементы
}

// Функция для безопасного парсинга необработанных данных
function safeParseRaw(raw: string): IRawAccountData | undefined {
  try {
    return JSON.parse(raw) as IRawAccountData; // Пробуем распарсить данные
  } catch (error) {
    return undefined; // Возвращаем undefined в случае ошибки
  }
}

const redditApiService = new RedditApiService()
export default redditApiService
