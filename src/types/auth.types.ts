export interface IUser {
	id: number
	username: string
	email: string
}

export interface IFormLogin { 
	username: string
	password: string
}

export interface IFormRegister {
	username: string
	email: string
	password: string
}

export interface IFormRedditAccount {
	username: string
	password: string
}