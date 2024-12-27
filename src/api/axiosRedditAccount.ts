import { REDDIT_URL } from '@/constants/constants'
import axios, { CreateAxiosDefaults } from 'axios'
import { getContentType } from './api.helper'

const axiosOptions: CreateAxiosDefaults = {
	baseURL: REDDIT_URL,
	headers: getContentType(),
	withCredentials: false,
}

export const instance = axios.create(axiosOptions)