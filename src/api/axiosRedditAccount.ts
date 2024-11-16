import { REDDIT_URL } from '@/constants/constants'
import axios, { CreateAxiosDefaults } from 'axios'
import { getContentType } from './api.helper'
import { refreshInterceptor } from './authRefreshToken'

const axiosOptions: CreateAxiosDefaults = {
	baseURL: REDDIT_URL,
	headers: getContentType(),
	withCredentials: true,
}

export const instance = axios.create(axiosOptions)

refreshInterceptor(instance)