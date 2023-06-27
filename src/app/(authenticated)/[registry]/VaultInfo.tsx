import { RoleLight, VaultLight } from "@/contracts/Registry";
import { getSafeOwner } from "@/contracts/Safe";

export default async function VaultInfo({vault}: {vault: VaultLight}) {
	const owners = await getSafeOwner(vault.address);

	return (
		<div className="flex justify-between">
			<div>{vault.name}</div>
			<div>{vault.address}</div>
			<div>{owners.length}</div>
		</div>
	)
}
	