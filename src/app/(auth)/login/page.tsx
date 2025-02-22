import type { Metadata } from "next"
import { AuthForm } from "../AuthForm"

export const metadata: Metadata = {
	title: "Login",
}

export default function LoginPage() {
	return (
		<div className='min-h-screen flex items-center justify-center bg-[#202938]'>
			<div className='bg-neutral-900 p-8 rounded-lg shadow-md'>
				<h2 className='font-bold mb-4'>Вход</h2>
				<AuthForm isLogin />
			</div>
		</div>
	)
}
