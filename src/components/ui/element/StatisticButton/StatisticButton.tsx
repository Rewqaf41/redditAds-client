import { LucideIcon } from "lucide-react"
import { createElement, forwardRef } from "react"

interface StatisticButtonProps {
	title?: string
	icon?: LucideIcon
}

export const StatisticButton = forwardRef<
	HTMLButtonElement,
	StatisticButtonProps
>(({ title, icon, ...props }, ref) => {
	return (
		<button
			ref={ref}
			className='bg-purple-600 p-3 rounded-full flex items-center gap-2 hover:bg-purple-800 transition-colors duration-300 ease-in-out'
			{...props}
		>
			{icon ? createElement(icon) : null}
			{title}
		</button>
	)
})

StatisticButton.displayName = "StatisticButton"
