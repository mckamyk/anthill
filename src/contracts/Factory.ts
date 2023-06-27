import { registryFactoryABI, registryRouterABI } from "@/generated"
import { getContract } from "viem"
import { publicClient } from "./clients"
import { getSession } from "@/tools/session"
import { getRegistryLight } from "./Registry"

export const routerAddress = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

const router = getContract({
	abi: registryRouterABI,
	address: routerAddress,
	publicClient,
})

export const getRegistryFactory = async () => {
	return getContract({
		abi: registryFactoryABI,
		address: await getFactoryAddress(),
		publicClient
	})
}

export const getFactoryAddress = async () => {
	return router.read.getAddress();
}

export const getRegistries = async () => {
	const factory = await getRegistryFactory();
	const session = await getSession();
	if (!session) throw new Error("No session found");

	const addresses = await factory.read.getUserRegistries([session.address])

	return Promise.all(addresses.map(getRegistryLight));
}