"use client"

import { cn } from "@/utils/tw-merge"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"
import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ComponentRef,
} from "react"

const RadioGroup = forwardRef<
	ComponentRef<typeof RadioGroupPrimitive.Root>,
	ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Root
			className={cn("grid gap-2", className)}
			{...props}
			ref={ref}
		/>
	)
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = forwardRef<
	ComponentRef<typeof RadioGroupPrimitive.Item>,
	ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Item
			ref={ref}
			className={cn(
				"aspect-square h-4 w-4 rounded-full border border-neutral-700 text-neutral-700 shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 disabled:cursor-not-allowed disabled:opacity-50",
				className
			)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator className='flex items-center justify-center'>
				<Circle className='h-3.5 w-3.5 fill-neutral-700' />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	)
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
