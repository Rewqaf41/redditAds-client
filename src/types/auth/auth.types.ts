export interface IUser {
	id: number
	username: string
}

export interface IFormAuth { 
	username: string
	password: string
}

export interface IFormRedditAccount {
	username: string
	code: string
}

export interface IFormRedditAccounts {
  accounts: { username: string }[];
}