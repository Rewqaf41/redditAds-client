"use client"
import { AddAds } from "@/components/ui/element/Ads/AddAds/AddAds"
import { EditAds } from "@/components/ui/element/Ads/EditAds/EditAds"
import { ButtonOpen } from "@/components/ui/element/ButtonOpen/ButtonOpen"
import { AddCamping } from "@/components/ui/element/Campaings/AddCamping/AddCamping"
import { EditCamping } from "@/components/ui/element/Campaings/EditCampaing/EditCamping"
import { AddGroup } from "@/components/ui/element/Group/AddGroup/AddGroup"
import { EditGroup } from "@/components/ui/element/Group/EditGroup/EditGroup"
import { Hint } from "@/components/ui/element/Hint/Hint"
import { useSearchContext } from "@/components/ui/element/SearchContext"
import { useAuth } from "@/hooks/useAuth"
import authService from "@/services/auth/auth.service"
import { cn } from "@/utils/tw-merge"
import { useMutation } from "@tanstack/react-query"
import { BadgePlus, FolderPlus, PenBox, Pencil, Trash2 } from "lucide-react"
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
	const [isEditing, setIsEditing] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { selectedItems, deleteSelectedItems } = useSearchContext()
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

	const handleDelete = () => {
		deleteSelectedItems()
		setIsModalOpen(false)
	}

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
						<div className='flex flex-col gap-y-5'>
							<ButtonOpen />
							<>
								<AddCamping
									isOpen={campingIsOpen}
									onClose={() => setCampingIsOpen(!campingIsOpen)}
								/>
								<button onClick={() => setCampingIsOpen(!campingIsOpen)}>
									<Hint label='Создать Кампанию' side='right' asChild>
										<BadgePlus size={27} className={styles.icon} />
									</Hint>
								</button>
							</>
							<>
								<AddGroup
									isOpen={groupIsOpen}
									onClose={() => setGroupIsOpen(!groupIsOpen)}
								/>
								<button onClick={() => setGroupIsOpen(!groupIsOpen)}>
									<Hint label='Создать Группу' side='right' asChild>
										<FolderPlus size={27} className={styles.icon} />
									</Hint>
								</button>
							</>
							<>
								<AddAds
									isOpen={adsIsOpen}
									onClose={() => setAdsIsOpen(!adsIsOpen)}
								/>
								<button onClick={() => setAdsIsOpen(!adsIsOpen)}>
									<Hint label='Создать Рекламу' side='right' asChild>
										<PenBox size={27} className={styles.icon} />
									</Hint>
								</button>
							</>
							{pathname !== "/accounts" && (
								<button
									onClick={() => setIsEditing(!isEditing)}
									disabled={
										selectedItems.length <= 0 || selectedItems.length > 1
									}
									className={cn(
										selectedItems.length > 1
											? "opacity-50 cursor-not-allowed"
											: "cursor-pointer",
										selectedItems.length <= 0
											? " opacity-50 cursor-not-allowed"
											: ""
									)}
								>
									<Pencil className={styles.icon} />
								</button>
							)}
							<button
								onClick={() => setIsModalOpen(true)}
								disabled={selectedItems.length <= 0}
								className={cn(
									selectedItems.length <= 0
										? "opacity-50 cursor-not-allowed"
										: "text-white"
								)}
							>
								<Trash2
									className={cn(
										styles.icon,
										"hover:!text-red-600 transition-colors duration-300 ease-in-out"
									)}
								/>
							</button>
						</div>
					</div>
					<div>
						<button onClick={() => mutateLogout()}>
							<TbLogout2 size={27} className={styles.icon} />
						</button>
					</div>
					{pathname === "/campaings" && (
						<EditCamping
							isOpen={isEditing}
							onClose={() => setIsEditing(!isEditing)}
						/>
					)}
					{pathname === "/groups" && (
						<EditGroup
							isOpen={isEditing}
							onClose={() => setIsEditing(!isEditing)}
						/>
					)}
					{pathname === "/ads" && (
						<EditAds
							isOpen={isEditing}
							onClose={() => setIsEditing(!isEditing)}
						/>
					)}
					{isModalOpen && (
						<div className={styles.modal}>
							<div className={styles.modal_container}>
								<h2 className={styles.modal_title}>Подтверждение удаления</h2>
								<p className='text-white mb-4'>
									Вы уверены, что хотите удалить выбранные элементы?
								</p>
								<div className={styles.buttons_group}>
									<button
										className={styles.button_confirm}
										onClick={handleDelete}
									>
										Удалить
									</button>
									<button
										className={styles.button_cancel}
										onClick={() => setIsModalOpen(false)}
									>
										Отмена
									</button>
								</div>
							</div>
						</div>
					)}
				</aside>
			) : (
				<div className='bg-[#202938]'></div>
			)}
		</>
	)
}
