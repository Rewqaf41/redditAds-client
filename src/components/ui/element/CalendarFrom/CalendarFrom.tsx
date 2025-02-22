"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "../../common/Calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../../common/Popover"
import Field from "../Field/Field"

export function CalendarForm({
	label,
	placeholder,
	field,
	fieldState,
	setValue,
}: any) {
	return (
		<div className='flex flex-col'>
			<label className='text-sm opacity-70'>{label}</label>
			<Popover>
				<PopoverTrigger asChild>
					<div>
						<Field
							className='border border-neutral-700 p-2 rounded-md cursor-pointer'
							readOnly
							value={field.value ? format(field.value, "PPP") : ""}
							placeholder={placeholder}
							error={fieldState.error}
							onClick={(e) => e.preventDefault()}
							Icon={CalendarIcon}
						/>
					</div>
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0' align='start'>
					<Calendar
						mode='single'
						selected={field.value}
						onSelect={(date) => setValue("start_time", date || new Date())}
						disabled={(date) =>
							date > new Date() || date < new Date("1900-01-01")
						}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
			{fieldState.error && (
				<div className='text-red-500 text-sm'>{fieldState.error.message}</div>
			)}
		</div>
	)
}
