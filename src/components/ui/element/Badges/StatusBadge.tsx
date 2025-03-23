import cn from "clsx"

interface IActiveBadge {
	status: string
}

export function StatusBadge({ status }: IActiveBadge) {
	const validStatuses = ["active", "loading", "disabled", "suspended"] as const
	const safeStatus = validStatuses.includes(status as any)
		? (status as IActiveBadge["status"])
		: "disabled"

	return (
		<div
			className={cn("px-3.5 rounded-xl w-max", {
				"border border-green-700 bg-green-900": safeStatus === "active",
				"border border-yellow-700 bg-yellow-900": safeStatus === "loading",
				"border border-rose-700 bg-red-900": ["disabled", "suspended"].includes(
					safeStatus
				),
			})}
		>
			{safeStatus === "active" && "Активен"}
			{safeStatus === "loading" && "Загружается"}
			{safeStatus === "suspended" && "Приостановлен"}
			{safeStatus === "disabled" && "Отключён"}
		</div>
	)
}
