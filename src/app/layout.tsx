"use client"
import { Header } from "@/components/layout/Header/Header"
import { Subheader } from "@/components/layout/Subheader/Subheader"
import { Inter } from "next/font/google"
import { usePathname } from "next/navigation"
import "./globals.scss"
import { Providers } from "./Providers"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const pathname = usePathname()
	return (
		<html lang='en'>
			<body className={inter.className}>
				<Providers>
					<Header />
					{pathname === "/accounts" ? <Subheader /> : null}
					{children}
				</Providers>
			</body>
		</html>
	)
}
