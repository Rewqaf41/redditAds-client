"use client"
import { useAuth } from "@/hooks/useAuth"
import cn from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MENU } from "./Header.data"
import styles from "./Header.module.scss"

export function Header() {
	const { isAuth } = useAuth()
	const pathname = usePathname()
	return isAuth ? (
		<div className={styles.header}>
			<div className={styles.container}>
				{MENU.map((item) => (
					<Link
						href={item.url}
						key={item.url}
						className={cn(styles.elements, {
							[styles.active]: pathname === item.url,
						})}
					>
						{item.name}
					</Link>
				))}
			</div>
		</div>
	) : null
}
