"use client"
import Field from "@/components/ui/element/Field/Field"
import { useSearchContext } from "@/components/ui/element/SearchContext"
import { useAuth } from "@/hooks/useAuth"
import { Search } from "lucide-react"
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
