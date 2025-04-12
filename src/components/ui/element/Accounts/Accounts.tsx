"use client"
import { accountStore } from "@/store/account/account.store"
import { Account, MetricsType } from "@/store/types"
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

export function Accounts() {
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
	} = accountStore()

	const [isSkeletonLoading, setIsSkeletonLoading] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsSkeletonLoading(false)
		}, 1500)

		return () => clearTimeout(timer)
	}, [])

	const filteredAccounts = items.filter((account: Account) =>
		account.username.toLowerCase().includes(searchQuery.toLowerCase())
	)

	const sortedAccounts = [...filteredAccounts].sort((a, b) => {
		if (sortKey === "username") {
			return sortOrder === "asc"
				? a.username.localeCompare(b.username)
				: b.username.localeCompare(a.username)
		}

		const key = sortKey as keyof MetricsType
		const getNumericValue = (value: string) => {
			const cleanedValue = value.replace(/[^0-9.]/g, "")
			return parseFloat(cleanedValue) || 0
		}

		const valueA = getNumericValue(a.metrics?.[0][key] || "")
		const valueB = getNumericValue(b.metrics?.[0][key] || "")

		return sortOrder === "asc" ? valueA - valueB : valueB - valueA
	})

	return (
		<div className='overflow-x-auto mb-6'>
			<table className='min-w-full table-auto'>
				<thead>
					<tr className='bg-[#0d121f]'>
						<th className='py-2 text-center'>
							<Checkbox
								checked={selectedItems.length === sortedAccounts.length}
								onCheckedChange={toggleAllSelection}
							/>
						</th>
						<th
							className='py-2 px-4 text-left cursor-pointer flex'
							onClick={() => setSortKey("username")}
						>
							<div className='flex'>
								Аккаунт
								{sortKey === "username" ? (
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
						<th className='py-2 px-4 text-left'>Статус</th>
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
										<Skeleton className='h-4 w-24' />
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
						: sortedAccounts.map((account) => {
								const metrics = account.metrics[0]
								const isSelected = selectedItems.includes(account.username)

								return (
									<tr
										key={account.username}
										className={
											isSelected
												? "bg-gray-200/20 cursor-pointer"
												: "cursor-pointer"
										}
										onClick={() => toggleItemSelection(account.username)}
									>
										<td
											className='py-2 px-4 text-center'
											onClick={(e) => e.stopPropagation()}
										>
											<Checkbox
												checked={isSelected}
												onCheckedChange={() =>
													toggleItemSelection(account.username)
												}
											/>
										</td>
										<td className='py-2 px-4 text-left'>{account.username}</td>
										<td className='py-2 text-left'>
											<StatusBadge status={account.status} />
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
