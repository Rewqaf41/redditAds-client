import { instance } from '@/api/axiosAuth'
import { IFormAuth } from '@/types/auth/auth.types'
import { getAccessToken, removeFromStorage, saveTokenStorage } from '../auth/auth.helper'

interface IAuthResponse {
	id: string
	accessToken: string
}

export enum EnumTokens {
	'ACCESS_TOKEN' = 'accessToken',
	'REFRESH_TOKEN' = 'refreshToken',
}

class AuthService {
	async login( data: IFormAuth ) {
		const response = await instance.post<IAuthResponse>(
			`/login`,
			data
		)


		if (response.data.accessToken) saveTokenStorage(response.data.accessToken)

		return response
	}

	async register( data: IFormAuth ) {
		const response = await instance.post<IAuthResponse>(
			`/register`,
			data
		)

		if (response.data.accessToken) saveTokenStorage(response.data.accessToken)

		return response
	}


	async getNewTokens() {
		const response = await instance.post<IAuthResponse>(
			'/refresh-tokens',
			{},
			{
				withCredentials: true,
			}
		)
		return response.data
	}

	async logout() {
		const accessToken = getAccessToken()
		
		try {
      const response = await instance.post<boolean>("/logout", {
        accessToken: accessToken || null,
      });

      if (response.data) {
        removeFromStorage();
      }

      return response;
    } catch (error) {
      console.error("Logout error:", error);
      removeFromStorage();
      return { data: true };
    }
	}
}

const authService = new AuthService()
export default authService
