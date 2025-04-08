"use client"

import { DoughnutChart } from "./Charts/DoughnutChart"
import { HorizontalBarChart } from "./Charts/HorizontalBar"

export function Statistic() {
	return (
		<>
			<div className='bg-[#101727] h-14 flex items-center p-5 sticky top-0'>
				Статистика
			</div>
			<div className='h-full w-full overflow-y-auto'>
				<div className='flex flex-col items-center justify-center'>
					<HorizontalBarChart />
				</div>
				<div className='mt-2 flex border-t-2 h-screen border-border'>
					<div className='mt-4 '>
						<DoughnutChart />
					</div>
				</div>
			</div>
		</>
	)
}
