"use client"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"
import { MENU } from "./Header.data"
import styles from "./Header.module.scss"

export function Header() {
	const isAuth = useAuth()
	return isAuth ? (
		<div className={styles.header}>
			<div className={styles.container}>
				{MENU.map((item) => (
					<Link href={item.url} key={item.url} className={styles.elements}>
						{item.name}
					</Link>
				))}
			</div>
		</div>
	) : null
}
