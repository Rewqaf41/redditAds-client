"use client"
import { useState } from "react"
import { FaUserPlus } from "react-icons/fa"
import AddAccount from "../AddAccount/AddAccount"
import styles from "./ButtonOpen.module.scss"

export function ButtonOpen(): JSX.Element {
	const [isWindowOpen, setIsWindowOpen] = useState(false)

	const ChangeWindow = () => {
		setIsWindowOpen(!isWindowOpen)
	}

	return (
		<div>
			<AddAccount isOpen={isWindowOpen} onClose={ChangeWindow} />
			<button className={styles.button_open} onClick={ChangeWindow}>
				<FaUserPlus className='mr-2' /> Добавление аккаунта
			</button>
		</div>
	)
}
