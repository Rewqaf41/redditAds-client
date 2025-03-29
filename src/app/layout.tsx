"use client"
import { Header } from "@/components/layout/Header/Header"
import { Subheader } from "@/components/layout/Subheader/Subheader"
import { SearchProvider } from "@/components/ui/element/SearchContext"
import { accountStore } from "@/store/account/account.store"
import { adsStore } from "@/store/ads/ads.store"
import { campaingsStore } from "@/store/campaing/campaings.store"
import { groupStore } from "@/store/group/group.store"
import { Account, Ad, BaseStore, Campaing, Group } from "@/store/types"
import { Inter } from "next/font/google"
import { usePathname } from "next/navigation"
import { Toaster } from "react-hot-toast"
import { StoreApi, UseBoundStore } from "zustand"
import "./globals.scss"
import { Providers } from "./Providers"

const inter = Inter({ subsets: ["latin"] })

type ZustandStore<T> = UseBoundStore<StoreApi<BaseStore<T>>>

type StoreMap = {
	"/accounts": ZustandStore<Account>
	"/campaings": ZustandStore<Campaing>
	"/groups": ZustandStore<Group>
	"/ads": ZustandStore<Ad>
}

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const pathname = usePathname()

	const storeMap: StoreMap = {
		"/accounts": accountStore,
		"/campaings": campaingsStore,
		"/groups": groupStore,
		"/ads": adsStore,
	}

	const getCurrentStore = (): ZustandStore<any> => {
		const matchedPath = Object.keys(storeMap).find((path) =>
			pathname?.startsWith(path)
		)
		return matchedPath ? storeMap[matchedPath as keyof StoreMap] : accountStore
	}

	const currentStore = getCurrentStore()

	return (
		<html lang='en'>
			<body className={inter.className}>
				<SearchProvider store={currentStore}>
					<Providers>
						<div className='flex'>
							<div className='flex-1'>
								<Header />
								<Subheader />
								{children}
								<Toaster position='bottom-right' />
							</div>
						</div>
					</Providers>
				</SearchProvider>
			</body>
		</html>
	)
}
