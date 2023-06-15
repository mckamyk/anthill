import { getSession } from "@/tools/session";
import { createPublicClient, createWalletClient, http } from "viem";
import { foundry } from "viem/chains";

export const publicClient = createPublicClient({
	chain: foundry,
	transport: http(),
})

export const getWallet = async () => {
	const session = await getSession();
	if (!session) throw new Error("No session found");
	return createWalletClient({
		chain: foundry,
		transport: http(),
		account: session.address,
	})
}
