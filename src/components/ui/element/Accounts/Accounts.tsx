"use client"

import { accountStore } from "@/store/account/account.store"
import { Checkbox } from "../../common/Checkbox"
import { StatusBadge } from "../Badges/StatusBadge"
import data from "./account.json"

export function Accounts() {
	const { selectedAccounts, toggleAccountSelection, toggleAllSelection } =
		accountStore()

	const handleSelectAll = (checked: boolean) => {
		toggleAllSelection(checked)
	}

	const handleRowSelect = (username: string, checked: boolean) => {
		toggleAccountSelection(username)
	}

	return (
		<div className='overflow-x-auto mb-6'>
			<table className='min-w-full table-auto'>
				<thead>
					<tr className='bg-[#0d121f]'>
						<th className='py-2 text-center'>
							<Checkbox
								checked={selectedAccounts.length === data.accounts.length}
								onCheckedChange={handleSelectAll}
							/>
						</th>
						<th className='py-2 px-4 text-left'>Аккаунт ↓</th>
						<th className='py-2 px-4 text-left'>Статус ↓</th>
						<th className='px-4 py-2 text-left'>Показы</th>
						<th className='px-4 py-2 text-left'>Расход</th>
						<th className='py-2 text-left'>Клики</th>
						<th className='px-4 py-2 text-left'>ECPM</th>
						<th className='px-4 py-2 text-left'>CPC</th>
						<th className='px-4 py-2 text-left'>CTR</th>
					</tr>
				</thead>
				<tbody>
					{data.accounts.map((account) => {
						const metrics = account.metrics[0]
						const isSelected = selectedAccounts.includes(account.username)

						return (
							<tr
								key={account.username}
								className={isSelected ? "bg-gray-200/20" : ""}
							>
								<td className='py-2 px-4 text-center'>
									<Checkbox
										checked={isSelected}
										onCheckedChange={(checked) =>
											handleRowSelect(account.username, checked as boolean)
										}
									/>
								</td>
								<td className='py-2 px-4 text-left'>{account.username}</td>
								<td className='py-2 text-left'>
									<StatusBadge status={account.status} />
								</td>
								<td className='py-2 px-4 text-left'>{metrics.impressions}</td>
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
