"use client"
import { useState } from "react"
import { FaUserPlus } from "react-icons/fa"
import AddAccount from "../Accounts/AddAccount/AddAccount"

export function ButtonOpen() {
	const [isWindowOpen, setIsWindowOpen] = useState(false)

	const ChangeWindow = () => {
		setIsWindowOpen(!isWindowOpen)
	}

	return (
		<div>
			<AddAccount isOpen={isWindowOpen} onClose={ChangeWindow} />
			<button onClick={ChangeWindow}>
				<FaUserPlus
					size={27}
					className='ml-1 text-[#6b7280] duration-300 ease-in-out transition-colors hover:text-white'
				/>
			</button>
		</div>
	)
}
