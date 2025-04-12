"use client"
import { useFilteredAndSortedItems } from "@/hooks/useFilteredAndSortedItems"
import { groupStore } from "@/store/group/group.store"
import {
	ArrowDownAZ,
	ArrowDownNarrowWide,
	ArrowDownWideNarrow,
	ArrowDownZA,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Checkbox } from "../../common/Checkbox"
import { Skeleton } from "../../common/Skeleton"
import { StatusBadge } from "../Badges/StatusBadge"

export function Groups() {
	const {
		items,
		selectedItems,
		toggleItemSelection,
		toggleAllSelection,
		searchQuery,
		sortKey,
		sortOrder,
		setSortKey,
		isLoading,
	} = groupStore()

	const [isSkeletonLoading, setIsSkeletonLoading] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsSkeletonLoading(false)
		}, 1500)

		return () => clearTimeout(timer)
	}, [])

	const sortedGroups = useFilteredAndSortedItems(
		items,
		searchQuery,
		sortKey,
		sortOrder
	)

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
			</div>
		)
	}

	return (
		<div className='overflow-x-auto mb-6'>
			<table className='min-w-full table-auto'>
				<thead>
					<tr className='bg-[#0d121f]'>
						<th className='py-2 text-center'>
							<Checkbox
								checked={selectedItems.length === sortedGroups.length}
								onCheckedChange={toggleAllSelection}
							/>
						</th>
						<th
							className='py-2 px-4 text-left cursor-pointer flex'
							onClick={() => setSortKey("name")}
						>
							<div className='flex'>
								Название Группы
								{sortKey === "name" ? (
									sortOrder === "asc" ? (
										<ArrowDownAZ size={20} />
									) : (
										<ArrowDownZA size={20} />
									)
								) : (
									"↓"
								)}
							</div>
						</th>
						<th className='py-2 px-4 cursor-pointer'>Статус</th>
						<th
							className='px-4 py-2 text-left cursor-pointer flex'
							onClick={() => setSortKey("impressions")}
						>
							Показы
							{sortKey === "impressions" ? (
								sortOrder === "asc" ? (
									<ArrowDownNarrowWide size={20} />
								) : (
									<ArrowDownWideNarrow size={20} />
								)
							) : (
								"↓"
							)}
						</th>
						<th
							className='px-4 py-2 text-left cursor-pointer'
							onClick={() => setSortKey("spend")}
						>
							<div className='flex'>
								Расход
								{sortKey === "spend" ? (
									sortOrder === "asc" ? (
										<ArrowDownNarrowWide size={20} />
									) : (
										<ArrowDownWideNarrow size={20} />
									)
								) : (
									"↓"
								)}
							</div>
						</th>
						<th
							className='py-2 text-left cursor-pointer'
							onClick={() => setSortKey("clicks")}
						>
							<div className='flex'>
								Клики
								{sortKey === "clicks" ? (
									sortOrder === "asc" ? (
										<ArrowDownNarrowWide size={20} />
									) : (
										<ArrowDownWideNarrow size={20} />
									)
								) : (
									"↓"
								)}
							</div>
						</th>
						<th
							className='px-4 py-2 text-left cursor-pointer'
							onClick={() => setSortKey("ecpm")}
						>
							<div className='flex'>
								ECPM
								{sortKey === "ecpm" ? (
									sortOrder === "asc" ? (
										<ArrowDownNarrowWide size={20} />
									) : (
										<ArrowDownWideNarrow size={20} />
									)
								) : (
									"↓"
								)}
							</div>
						</th>
						<th
							className='px-4 py-2 text-left cursor-pointer'
							onClick={() => setSortKey("cpc")}
						>
							<div className='flex'>
								CPC
								{sortKey === "cpc" ? (
									sortOrder === "asc" ? (
										<ArrowDownNarrowWide size={20} />
									) : (
										<ArrowDownWideNarrow size={20} />
									)
								) : (
									"↓"
								)}
							</div>
						</th>
						<th
							className='px-4 py-2 text-left cursor-pointer'
							onClick={() => setSortKey("ctr")}
						>
							<div className='flex'>
								CTR
								{sortKey === "ctr" ? (
									sortOrder === "asc" ? (
										<ArrowDownNarrowWide size={20} />
									) : (
										<ArrowDownWideNarrow size={20} />
									)
								) : (
									"↓"
								)}
							</div>
						</th>
					</tr>
				</thead>
				<tbody>
					{isLoading || isSkeletonLoading
						? [...Array(items.length)].map((_, index) => (
								<tr key={index}>
									<td className='py-2 px-4'>
										<Skeleton className='h-4 w-6 mx-auto' />
									</td>
									<td className='py-2 px-4'>
										<Skeleton className='h-4 w-40' />
									</td>
									<td className='py-2 px-4'>
										<Skeleton className='h-4 w-16' />
									</td>
									<td className='py-2 px-4'>
										<Skeleton className='h-4 w-20' />
									</td>
									<td className='py-2 px-4'>
										<Skeleton className='h-4 w-20' />
									</td>
									<td className='py-2 px-4'>
										<Skeleton className='h-4 w-16' />
									</td>
									<td className='py-2 px-4'>
										<Skeleton className='h-4 w-16' />
									</td>
									<td className='py-2 px-4'>
										<Skeleton className='h-4 w-16' />
									</td>
									<td className='py-2 px-4'>
										<Skeleton className='h-4 w-16' />
									</td>
								</tr>
						  ))
						: sortedGroups.map((group) => {
								const metrics = group.metrics?.[0] || {}
								const isSelected = selectedItems.includes(group.name)

								return (
									<tr
										key={group.name}
										className={
											isSelected
												? "bg-gray-200/20 cursor-pointer"
												: "cursor-pointer"
										}
										onClick={() => toggleItemSelection(group.name)}
									>
										<td
											className='py-2 px-4 text-center'
											onClick={(e) => e.stopPropagation()}
										>
											<Checkbox
												checked={isSelected}
												onCheckedChange={() => toggleItemSelection(group.name)}
											/>
										</td>
										<td className='py-2 px-4 text-left'>
											<div>
												{group.name}
												<span className='text-sm opacity-70 flex flex-wrap'>
													{Array.isArray(group.campaigns)
														? group.campaigns.join(", ")
														: group.campaigns}
												</span>
											</div>
										</td>
										<td className='py-2 text-left'>
											<StatusBadge status={group.status} />
										</td>
										<td className='py-2 px-4 text-left'>
											{metrics.impressions}
										</td>
										<td className='py-2 px-4 text-left'>{metrics.spend} USD</td>
										<td className='py-2 text-left'>{metrics.clicks}</td>
										<td className='py-2 px-5 text-left'>{metrics.ecpm}</td>
										<td className='py-2 px-5 text-left'>{metrics.cpc}</td>
										<td className='py-2 px-5 text-left'>{metrics.ctr}</td>
									</tr>
								)
						  })}
				</tbody>
			</table>
		</div>
	)
}
