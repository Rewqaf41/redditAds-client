"use client"
import { ButtonOpen } from "@/components/ui/element/ButtonOpen/ButtonOpen"
import Field from "@/components/ui/element/Field/Field"
import { useAuth } from "@/hooks/useAuth"
import { accountStore } from "@/store/account/account.store"
import { Pencil, Search, Trash2 } from "lucide-react"
import styles from "./Subheader.module.scss"

export function Subheader() {
	const { isAuth } = useAuth()
	const { selectedAccounts } = accountStore()
	return isAuth ? (
		<div className={styles.subheader}>
			<div className={styles.containers}>
				<div className={styles.elements}>
					{selectedAccounts.length ? (
						<div className='flex gap-x-5'>
							<button>
								<Pencil className='hover:opacity-50' />
							</button>
							<button>
								<Trash2 className='hover:text-red-600' />
							</button>
						</div>
					) : null}
					<ButtonOpen />
					<Field
						className={styles.search}
						placeholder='Найти аккаунт'
						Icon={Search}
					/>
				</div>
			</div>
		</div>
	) : null
}
