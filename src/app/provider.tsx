'use client'
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum"
import { Web3Modal } from "@web3modal/react"
import React from "react"
import { configureChains, createClient, WagmiConfig } from "wagmi"
import {hardhat} from 'wagmi/chains'

const chains = [hardhat]
const projectId = '6c1e4f11c58134a472f755910a5249d6'

const {provider} = configureChains(chains, [w3mProvider({projectId})])
const wagmiClient = createClient({
	autoConnect: true,
	connectors: w3mConnectors({projectId, version: 1, chains}),
	provider
})
const ethereumClient = new EthereumClient(wagmiClient, chains);

export default function Providers({children}: {children: React.ReactNode}) {
	return (
		<>
			<WagmiConfig client={wagmiClient}>
				{children}
			</WagmiConfig>

			<Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
		</>
	)
}