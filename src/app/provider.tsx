'use client'
import { configureChains, createConfig, useAccount, WagmiConfig, useNetwork, ConnectorData} from "wagmi"
import {foundry} from 'wagmi/chains'
import {publicProvider} from 'wagmi/providers/public';
import { SessionProvider, useSession } from "next-auth/react"
import {WalletConnectConnector} from 'wagmi/connectors/walletConnect'
import {MetaMaskConnector} from 'wagmi/connectors/metaMask'
import {CoinbaseWalletConnector} from 'wagmi/connectors/coinbaseWallet';
import React, { useEffect, useState } from "react";
import InvalidAccount from "@/components/InvalidAccount";
import ToastProvider from "@/components/Toast";
import { useRouter } from "next/navigation";

const projectId = '6c1e4f11c58134a472f755910a5249d6'

const {chains, publicClient, webSocketPublicClient} = configureChains([foundry], [publicProvider()])
const config = createConfig({
	autoConnect: true,
	connectors: [
		new MetaMaskConnector({chains}),
		new CoinbaseWalletConnector({
			chains, 
			options: {
				appName: "Anthill"
			}
		}),
		new WalletConnectConnector({
			chains,
			options: {
				projectId
			}
		})
	],
	publicClient,
	webSocketPublicClient
})

export default function Providers({children, session}: {children: React.ReactNode, session: any}) {
	return (
		<WagmiConfig config={config}>
			<SessionProvider session={session} >
				<ToastProvider>
					<AccountManagement>
						{children}
					</AccountManagement>
				</ToastProvider>
			</SessionProvider>
		</WagmiConfig>
	)
}

const AccountManagement = ({children}: {children: React.ReactNode}) => {
	const {connector, address, isConnected} = useAccount();
	const {data: session} = useSession();
	const [invalidAccount, setInvalid] = useState<boolean>(false);
	const router = useRouter();

	useEffect(() => {
		if (!isConnected) {
			router.push("/login")
		}

		const handleConnectorUpdate = ({account, chain}: ConnectorData) => {
			if (account) {
				if (account !== session?.address) {
					setInvalid(true);
				}
			}
			if (chain) {
				if (chain.unsupported) {
					alert("This chain isn't supported yet.")
				}
			}
			if (!account) {
				router.push("/login")
			}
		}

		if (connector) connector.on('change', handleConnectorUpdate);
		const removeConnector = () => {
			connector?.off('change', handleConnectorUpdate);
		}

		return removeConnector
	}, [connector, session?.address, setInvalid, isConnected]);


	return (
		<>
			{invalidAccount && <InvalidAccount sessionAddress={session?.address} connectedAddress={address} />}
			{children}
		</>
	)
}