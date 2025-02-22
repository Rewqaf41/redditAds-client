export const NODE_ENV = 'production' as string

export const AUTH_URL = NODE_ENV === 'dev' ? 'http://localhost:12345/api/v1' : 'https://decomate.ru/api/v1'
export const REDDIT_URL = NODE_ENV === 'dev' ? 'http://localhost:3002/api/v1' : 'https://decomate.ru/api/v1'
export const REDDIT_API_URL = NODE_ENV === 'dev' ? 'http://localhost:3002/api/v3' : 'https://decomate.ru/api/v3'
export const IS_CLIENT = typeof window !== 'undefined'
