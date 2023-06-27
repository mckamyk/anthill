import { ethersProvider } from './clients'
import { EthersAdapter } from '@safe-global/protocol-kit'
import { ethers } from 'ethers'

const ethAdapter = new EthersAdapter({
	ethers,
	signerOrProvider: ethersProvider,
})

export const getSafeContract = (address: string) => ethAdapter.getSafeContract({
	customContractAddress: address,
	safeVersion: '1.3.0'
})

export const getSafeOwners = (address: `0x${string}`) => getSafeContract(address).then(c => c.getOwners()) as Promise<`0x${string}`[]>