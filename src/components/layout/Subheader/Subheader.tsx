"use client"
import { ButtonOpen } from "@/components/ui/element/ButtonOpen/ButtonOpen"
import Field from "@/components/ui/element/Field/Field"
import { useSearchContext } from "@/components/ui/element/SearchContext"
import { useAuth } from "@/hooks/useAuth"
import { Pencil, Search, Trash2 } from "lucide-react"
import { usePathname } from "next/navigation"
import styles from "./Subheader.module.scss"

export function Subheader() {
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
							<button>
								<Pencil className='hover:opacity-50' />
							</button>
							<button onClick={deleteSelectedItems}>
								<Trash2 className='hover:text-red-600' />
							</button>
						</div>
					)}
					{pathname && <ButtonOpen />}
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
