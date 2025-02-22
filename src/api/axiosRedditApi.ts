import { REDDIT_API_URL } from '@/constants/constants'
import axios, { type CreateAxiosDefaults } from 'axios'
import { getContentType } from './api.helper'

const axiosOptions: CreateAxiosDefaults = {
	baseURL: REDDIT_API_URL,
	headers: getContentType(),
	withCredentials: false,
}

export const instance = axios.create(axiosOptions)