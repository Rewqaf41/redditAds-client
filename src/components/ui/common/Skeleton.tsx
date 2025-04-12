import { cn } from "@/utils/tw-merge"
import { HTMLAttributes } from "react"

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn("animate-pulse rounded-md bg-gray-400/10", className)}
			{...props}
		/>
	)
}

export { Skeleton }
