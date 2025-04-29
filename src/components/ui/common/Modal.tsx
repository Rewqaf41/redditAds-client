"use client"

import { AnimatePresence, motion } from "framer-motion"
import { IoMdClose } from "react-icons/io"

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	children: React.ReactNode
	title?: string
}

export const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	children,
	title,
}) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<motion.div
						className='bg-[#1a2332] p-6 rounded-lg w-full max-w-md relative'
						initial={{ scale: 0.9 }}
						animate={{ scale: 1 }}
						exit={{ scale: 0.9 }}
					>
						<button
							onClick={onClose}
							className='absolute top-3 right-3 text-2xl text-neutral-400 hover:text-white'
						>
							<IoMdClose />
						</button>
						{title && <h2 className='text-xl font-semibold mb-4'>{title}</h2>}
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
