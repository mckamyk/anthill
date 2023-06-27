import { getSession } from "@/tools/session";
import { providers } from "ethers";
import { HttpTransport, PublicClient, createPublicClient, createWalletClient, http } from "viem";
import { foundry } from "viem/chains";

export const publicClient = createPublicClient({
	chain: foundry,
	transport: http(),
})

export const ethersProvider = publicClientToProvider(publicClient)

export const getWallet = async () => {
	const session = await getSession();
	if (!session) throw new Error("No session found");
	return createWalletClient({
		chain: foundry,
		transport: http(),
		account: session.address,
	})
}

function publicClientToProvider(publicClient: PublicClient) {
	const { chain, transport } = publicClient
	const network = {
		chainId: chain!.id,
		name: chain!.name,
		ensAddress: chain!.contracts?.ensRegistry?.address,
	}
	if (transport.type === 'fallback')
		return new providers.FallbackProvider(
			(transport.transports as ReturnType<HttpTransport>[]).map(
				({ value }) => new providers.JsonRpcProvider(value?.url, network),
			),
		)
	return new providers.JsonRpcProvider(transport.url, network)
}