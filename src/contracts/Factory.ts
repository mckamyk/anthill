import { registryFactoryABI, registryRouterABI } from "@/generated"
import { getContract } from "viem"
import { publicClient } from "./clients"
import { getSession } from "@/tools/session"
import { getRegistryLight } from "./Registry"

export const routerAddress = "0xb7f8bc63bbcad18155201308c8f3540b07f84f5e";

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