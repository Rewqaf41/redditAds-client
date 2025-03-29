"use client"
import { EditAds } from "@/components/ui/element/Ads/EditAds/EditAds"
import { ButtonOpen } from "@/components/ui/element/ButtonOpen/ButtonOpen"
import { EditCamping } from "@/components/ui/element/Campaings/EditCampaing/EditCamping"
import Field from "@/components/ui/element/Field/Field"
import { EditGroup } from "@/components/ui/element/Group/EditGroup/EditGroup"
import { useSearchContext } from "@/components/ui/element/SearchContext"
import { useAuth } from "@/hooks/useAuth"
import cn from "clsx"
import { Pencil, Search, Trash2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import styles from "./Subheader.module.scss"

export function Subheader() {
	const [isEditing, setIsEditing] = useState<boolean>(false)

	const { isAuth } = useAuth()
	const pathname = usePathname()
	const { searchQuery, setSearchQuery, selectedItems, deleteSelectedItems } =
		useSearchContext()

	if (!isAuth) return null

	return (
		<div className={styles.subheader}>
			<div className={styles.containers}>
				<div className={styles.elements}>
					{selectedItems.length > 0 && (
						<div className='flex gap-x-5'>
							{pathname !== "/accounts" && (
								<button
									onClick={() => setIsEditing(!isEditing)}
									disabled={selectedItems.length > 1}
									className={cn(
										selectedItems.length > 1
											? "opacity-50 cursor-not-allowed"
											: ""
									)}
								>
									<Pencil className='hover:opacity-50' />
								</button>
							)}
							<button onClick={deleteSelectedItems}>
								<Trash2 className='hover:text-red-600 transition-colors duration-300 ease-in-out' />
							</button>
						</div>
					)}
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

					{pathname === "/accounts" ? <ButtonOpen /> : null}
					<Field
						className={styles.search}
						placeholder='Поиск'
						Icon={Search}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>
		</div>
	)
}
