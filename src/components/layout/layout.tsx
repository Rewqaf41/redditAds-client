import { AreaChart } from "lucide-react"
import type { PropsWithChildren } from "react"
import { useSearchContext } from "../ui/element/SearchContext"
import { StatisticButton } from "../ui/element/StatisticButton/StatisticButton"
import styles from "./layout.module.scss"
import { Sidebar } from "./Sidebar/Sidebar"

export default function LayoutClient({ children }: PropsWithChildren<unknown>) {
	const { selectedItems } = useSearchContext()
	return (
		<main className={styles.layout}>
			<Sidebar />
			<section>{children}</section>
			{selectedItems.length > 0 && (
				<div className='absolute bottom-5 right-5'>
					<StatisticButton icon={AreaChart} />
				</div>
			)}
		</main>
	)
}
