"use client"

import { cn } from "@/utils/tw-merge"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import * as React from "react"

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
	<CheckboxPrimitive.Root
		ref={ref}
		className={cn(
			"h-4 w-4 shrink-0 rounded-sm border border-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-black data-[state=checked]:text-white-foreground",
			className
		)}
		{...props}
	>
		<CheckboxPrimitive.Indicator
			className={cn("flex items-center justify-center")}
		>
			<Check className='h-3.5 w-3.5' />
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
