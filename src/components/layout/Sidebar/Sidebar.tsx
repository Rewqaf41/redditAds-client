"use client"
import { useAuth } from "@/hooks/useAuth"
import authService from "@/services/auth.service"
import { useMutation } from "@tanstack/react-query"
import cn from "clsx"
import { Settings } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { AiOutlineHome } from "react-icons/ai"
import { FcReddit } from "react-icons/fc"
import { LuShare2 } from "react-icons/lu"
import { TbLogout2 } from "react-icons/tb"
import styles from "./Sidebar.module.scss"

export function Sidebar() {
	const isAuth = useAuth()
	const { push } = useRouter()
	const { mutate: mutateLogout, isPending: isLogoutPending } = useMutation({
		mutationKey: ["logout"],
		mutationFn: () => authService.logout(),
		onSuccess() {
			push("/login")
		},
	})
	const pathname = usePathname()
	return (
		<>
			{isAuth ? (
				<aside className={styles.sidebar}>
					<div>
						<div className='block mb-8'>
							<div className={styles.logo}>
								<FcReddit size={27} className='text-white' />
							</div>
						</div>
						<Link
							href='/'
							className={cn({
								[styles.active]: pathname === "/",
							})}
						>
							<AiOutlineHome size={27} />
						</Link>
						<button>
							<LuShare2 size={27} />
						</button>
					</div>
					<div>
						<Link href='/settings'>
							<Settings size={27} />
						</Link>
						<button onClick={() => mutateLogout()}>
							<TbLogout2 size={27} />
						</button>
					</div>
				</aside>
			) : (
				<div className='bg-neutral-950'></div>
			)}
		</>
	)
}
