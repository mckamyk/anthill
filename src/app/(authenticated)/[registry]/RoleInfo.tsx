import { RoleLight } from "@/contracts/Registry";
import { getWallet } from "@/contracts/clients";
import { getSafe } from "@/generated";
import { foundry } from "viem/chains";

export default async function RoleInfo({role}: {role: RoleLight}) {
	const roleFull = await role.fill();
	const wallet = await getWallet()

	const safe = getSafe({
		address: roleFull.address,
		walletClient: wallet,
		chainId: foundry.id,
	})

	return (
		<div className="flex justify-between">
			<div>{roleFull.name}</div>
			<div>{roleFull.address}</div>
			<div>{roleFull.owners.length}</div>
		</div>
	)
}
