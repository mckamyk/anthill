'use client'
import React from "react"
import { configureChains, createConfig, WagmiConfig } from "wagmi"
import {foundry} from 'wagmi/chains'
import {publicProvider} from 'wagmi/providers/public';
import { SessionProvider } from "next-auth/react"
import {WalletConnectConnector} from 'wagmi/connectors/walletConnect'
import {MetaMaskConnector} from 'wagmi/connectors/metaMask'
import {CoinbaseWalletConnector} from 'wagmi/connectors/coinbaseWallet';

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
		<>
			<WagmiConfig config={config}>
				<SessionProvider session={session} >
					{children}
				</SessionProvider>
			</WagmiConfig>
		</>
	)
}