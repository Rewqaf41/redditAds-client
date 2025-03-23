import { format, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
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
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		field.value ? parseISO(field.value) : undefined
	)

	const handleDateTimeChange = (date: Date | undefined) => {
		if (!date) return
		setSelectedDate(date)
		setValue(field.name, date.toISOString())
	}

	return (
		<div className='flex flex-col gap-2'>
			<label className='text-sm opacity-70'>{label}</label>
			<Popover>
				<PopoverTrigger asChild>
					<div>
						<Field
							className='border border-neutral-700 p-2 rounded-md cursor-pointer'
							readOnly
							value={
								selectedDate
									? format(selectedDate, "MMMM d, yyyy h:mm a 'UTC'")
									: ""
							}
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
						selected={selectedDate}
						onSelect={handleDateTimeChange}
						disabled={(date) => date < new Date("1900-01-01")}
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
