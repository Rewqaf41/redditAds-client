import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip"
import type { PropsWithChildren } from "react"
import { Tooltip, TooltipProvider } from "../../common/Tooltip"

interface HintProps {
	label: string
	asChild: boolean
	side?: "top" | "bottom" | "left" | "right"
	align?: "start" | "center" | "end"
}

export function Hint({
	children,
	label,
	side,
	align,
	asChild,
}: PropsWithChildren<HintProps>) {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={0}>
				<TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
				<TooltipContent
					className='bg-white border border-black rounded-xl m-2'
					side={side}
					align={align}
				>
					<p className='font-semibold text-black p-1'>{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
