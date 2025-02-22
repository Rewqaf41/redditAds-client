import cn from "clsx"
import type { PropsWithChildren } from "react"
interface ButtonProps {
	className?: string
	onClick?: () => void
	type?: "button" | "submit" | "reset" // Добавьте это
}

export function Button({
	children,
	className,
	type,
	...props
}: PropsWithChildren<ButtonProps>) {
	return (
		<button
			type={type}
			className={cn("bg-transparent p-2 border rounded-md w-full", className)}
			{...props}
		>
			{children}
		</button>
	)
}
