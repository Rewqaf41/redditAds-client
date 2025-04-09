"use client"

import { DoughnutChart } from "./Charts/DoughnutChart"
import { HorizontalBarChart } from "./Charts/HorizontalBar"

export function Statistic() {
	return (
		<>
			<div className='h-screen w-full'>
				<div className='flex flex-col items-center justify-center'>
					<HorizontalBarChart />
				</div>
				<div className='mt-2 flex border-t-2 border-border'>
					<div className='mt-4'>
						<DoughnutChart />
					</div>
				</div>
			</div>
		</>
	)
}
