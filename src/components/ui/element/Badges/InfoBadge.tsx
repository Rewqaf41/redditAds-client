import { BadgeInfo } from "lucide-react"
import type { PropsWithChildren } from "react"
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../../common/HoverCard"

interface InfoBageProps {
	side?: "top" | "bottom" | "left" | "right"
}

export function InfoBadge({
	children,
	side,
}: PropsWithChildren<InfoBageProps>) {
	return (
		<HoverCard closeDelay={0} openDelay={0}>
			<HoverCardTrigger>
				<BadgeInfo className='w-4 h-4' />
			</HoverCardTrigger>
			<HoverCardContent side={side}>{children}</HoverCardContent>
		</HoverCard>
	)
}
