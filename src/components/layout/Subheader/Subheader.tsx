"use client"
import { ButtonOpen } from "@/components/ui/ButtonOpen/ButtonOpen"
import Field from "@/components/ui/Field/Field"
import { useAuth } from "@/hooks/useAuth"
import { Search } from "lucide-react"
import styles from "./Subheader.module.scss"

export function Subheader() {
	const Auth = useAuth()
	return Auth ? (
		<div className={styles.subheader}>
			<div className={styles.containers}>
				<div className={styles.elements}>
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
