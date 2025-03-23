"use client"
import data from "@/components/ui/element/Accounts/account.json"
import { AddAds } from "@/components/ui/element/AddAds/AddAds"
import { AddCamping } from "@/components/ui/element/AddCamping/AddCamping"
import { AddGroup } from "@/components/ui/element/AddGroup/AddGroup"
import { Hint } from "@/components/ui/element/Hint/Hint"
import { useAuth } from "@/hooks/useAuth"
import authService from "@/services/auth/auth.service"
import { accountStore } from "@/store/account/account.store"
import { useMutation } from "@tanstack/react-query"
import { BadgePlus, FolderPlus, PenBox } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FcReddit } from "react-icons/fc"
import { TbLogout2 } from "react-icons/tb"
import styles from "./Sidebar.module.scss"

export function Sidebar() {
	const [campingIsOpen, setCampingIsOpen] = useState(false)
	const [groupIsOpen, setGroupIsOpen] = useState(false)
	const [adsIsOpen, setAdsIsOpen] = useState(false)
	const { selectedItems } = accountStore()
	const { isAuth, exit } = useAuth()
	const { push } = useRouter()
	const { mutate: mutateLogout } = useMutation({
		mutationKey: ["logout"],
		mutationFn: () => authService.logout(),
		onSuccess() {
			exit()
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
						{selectedItems.length && !hasDisabledAccount ? (
							<>
								<div className='pb-5'>
									<AddCamping
										isOpen={campingIsOpen}
										onClose={() => setCampingIsOpen(!campingIsOpen)}
									/>
									<button onClick={() => setCampingIsOpen(!campingIsOpen)}>
										<Hint label='Создать Кампанию' side='right' asChild>
											<BadgePlus size={27} />
										</Hint>
									</button>
								</div>
								<div className='pb-5'>
									<AddGroup
										isOpen={groupIsOpen}
										onClose={() => setGroupIsOpen(!groupIsOpen)}
									/>
									<button onClick={() => setGroupIsOpen(!groupIsOpen)}>
										<Hint label='Создать Группу' side='right' asChild>
											<FolderPlus size={27} />
										</Hint>
									</button>
								</div>
								<div className='pb-5'>
									<AddAds
										isOpen={adsIsOpen}
										onClose={() => setAdsIsOpen(!adsIsOpen)}
									/>
									<button onClick={() => setAdsIsOpen(!adsIsOpen)}>
										<Hint label='Создать Рекламу' side='right' asChild>
											<PenBox size={27} />
										</Hint>
									</button>
								</div>
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
