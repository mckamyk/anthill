import { getServerSession } from 'next-auth';
import { registryRouterABI, registryFactoryABI, registryABI } from '../../generated'
import { createWalletClient, http, createPublicClient, getContract } from 'viem';
import { foundry } from 'viem/chains';
import { authOptions } from '../api/auth/[...nextauth]/route';

type address = `0x${string}`;

export const getClients = async () => {
	const publicClient = createPublicClient({
		chain: foundry,
		transport: http(),
	})

	return { publicClient }
}

const getRouter = async () => {
	const { publicClient } = await getClients();

	return getContract({
		abi: registryRouterABI,
		address: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
		publicClient,
	})
}

export const getRegsitryFactory = async () => {
	const router = await getRouter();
	const address = await router.read.FactoryAddress();
	const { publicClient } = await getClients();

	return getContract({
		abi: registryFactoryABI,
		address, publicClient,
	})
}

export const getRegsitryFactoryAddress = async () => {
	const router = await getRouter();
	const address = await router.read.FactoryAddress();

	return address
}

const dummyRegistry = getContract({ abi: registryABI, address: '0x0', publicClient: undefined, walletClient: undefined });

interface RegistryInfo {
	name: string;
	address: `0x${string}`;
	contract: typeof dummyRegistry
}

export const getRegistries = async (userAddress: address): Promise<RegistryInfo[]> => {
	const factory = await getRegsitryFactory();
	const registries = await factory.read.getUserRegistries([userAddress]);

	return Promise.all(registries.map(getRegistryInfo));
}

const getRegistryInfo = async (address: address): Promise<RegistryInfo> => {
	const clients = await getClients();
	const contract = getContract({
		abi: registryABI,
		address, ...clients
	})

	return {
		name: await contract.read.name(),
		address, contract
	}
}

interface Session {
	address: `0x${string}`
}

