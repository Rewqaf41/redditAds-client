import { z } from 'zod'

export const loginSchema = z.object({
	username: z.string().min(1).regex(/^[a-zA-Z0-9_]+$/, "Логин может содержать только латинские буквы, цифры и _"),
	password: z.string(),
})

export type TypeLoginSchema = z.infer<typeof loginSchema>
