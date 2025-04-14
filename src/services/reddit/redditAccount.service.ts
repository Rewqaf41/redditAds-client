import { instance } from '@/api/axiosRedditAccount'
import { IFormRedditAccount } from '@/types/auth/auth.types'
import { getAccessToken } from '../auth/auth.helper'

class RedditAccountService {
  
  // Метод для добавления аккаунта Reddit
  async addAccount(data: IFormRedditAccount) {
    const token = getAccessToken() // Получаем токен авторизации
    const response = await instance.post(
      `/add-account`, // Запрос на добавление аккаунта
      data, // Данные аккаунта
      {
        headers: {
          Authorization: `Bearer ${token}` // Добавляем токен в заголовки запроса
        }
      }
    )
    return response // Возвращаем результат добавления аккаунта
  }

  // Метод для получения всех аккаунтов Reddit
  async getAccounts() {
    const token = getAccessToken() // Получаем токен авторизации
    const response = await instance.get(`/accounts`, {
      headers: {
        Authorization: `Bearer ${token}` // Добавляем токен в заголовки запроса
      }
    })
    return response // Возвращаем список аккаунтов
  }
}

// Создаем экземпляр сервиса RedditAccountService
const redditAccountService = new RedditAccountService()

// Экспортируем экземпляр сервиса для использования в других частях приложения
export default redditAccountService
