"use client"
import data from "@/components/ui/element/Accounts/account.json"
import { AddAds } from "@/components/ui/element/Ads/AddAds/AddAds"
import { AddCamping } from "@/components/ui/element/Campaings/AddCamping/AddCamping"
import { AddGroup } from "@/components/ui/element/Group/AddGroup/AddGroup"
import { Hint } from "@/components/ui/element/Hint/Hint"
import { useSearchContext } from "@/components/ui/element/SearchContext"
import { useAuth } from "@/hooks/useAuth"
import authService from "@/services/auth/auth.service"
import { useMutation } from "@tanstack/react-query"
import { BadgePlus, FolderPlus, PenBox } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
import { FcReddit } from "react-icons/fc"
import { TbLogout2 } from "react-icons/tb"
import styles from "./Sidebar.module.scss"

export function Sidebar() {
	const [campingIsOpen, setCampingIsOpen] = useState(false)
	const [groupIsOpen, setGroupIsOpen] = useState(false)
	const [adsIsOpen, setAdsIsOpen] = useState(false)
	const { selectedItems } = useSearchContext()
	const { isAuth, exit } = useAuth()
	const { push } = useRouter()
	const pathname = usePathname()

	const { mutate: mutateLogout } = useMutation({
		mutationKey: ["logout"],
		mutationFn: () => authService.logout(),
		onSuccess() {
			exit()
			toast.success("Вы успешно вышли")
			push("/login")
		},
	})

	const hasDisabledAccount = selectedItems.some((username) => {
		const account = data.accounts.find((acc) => acc.username === username)
		return account?.status === "disabled" || account?.status === "loading"
	})

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
						{pathname === "/accounts" ? (
							<>
								<AddCamping
									isOpen={campingIsOpen}
									onClose={() => setCampingIsOpen(!campingIsOpen)}
								/>
								<button onClick={() => setCampingIsOpen(!campingIsOpen)}>
									<Hint label='Создать Кампанию' side='right' asChild>
										<BadgePlus size={27} />
									</Hint>
								</button>
							</>
						) : null}
						{pathname === "/campaings" ? (
							<>
								<AddGroup
									isOpen={groupIsOpen}
									onClose={() => setGroupIsOpen(!groupIsOpen)}
								/>
								<button onClick={() => setGroupIsOpen(!groupIsOpen)}>
									<Hint label='Создать Группу' side='right' asChild>
										<FolderPlus size={27} />
									</Hint>
								</button>
							</>
						) : null}
						{pathname === "/groups" ? (
							<>
								<AddAds
									isOpen={adsIsOpen}
									onClose={() => setAdsIsOpen(!adsIsOpen)}
								/>
								<button onClick={() => setAdsIsOpen(!adsIsOpen)}>
									<Hint label='Создать Рекламу' side='right' asChild>
										<PenBox size={27} />
									</Hint>
								</button>
							</>
						) : null}
					</div>
					<div>
						<button onClick={() => mutateLogout()}>
							<TbLogout2 size={27} />
						</button>
					</div>
				</aside>
			) : (
				<div className='bg-[#202938]'></div>
			)}
		</>
	)
}
