import { AreaChart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { PropsWithChildren } from "react"
import { useSearchContext } from "../ui/element/SearchContext"
import { StatisticButton } from "../ui/element/Statistic/StatisticButton/StatisticButton"
import styles from "./layout.module.scss"
import { Sidebar } from "./Sidebar/Sidebar"

export default function LayoutClient({ children }: PropsWithChildren<unknown>) {
	const { selectedItems } = useSearchContext()
	const pathname = usePathname()
	return (
		<main className={styles.layout}>
			<Sidebar />
			<section className={styles.content}>{children}</section>
			{selectedItems.length > 0 && pathname !== "/statistics" && (
				<Link href='/statistics' className='absolute bottom-5 right-5'>
					<StatisticButton icon={AreaChart} />
				</Link>
			)}
		</main>
	)
}
