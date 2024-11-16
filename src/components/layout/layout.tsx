import type { PropsWithChildren } from "react"
import styles from "./layout.module.scss"
import { Sidebar } from "./Sidebar/Sidebar"

export default function LayoutClient({ children }: PropsWithChildren<unknown>) {
	return (
		<main className={styles.layout}>
			<Sidebar />
			<section>{children}</section>
		</main>
	)
}
