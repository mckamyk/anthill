import { RoleLight } from "@/contracts/Registry";

export default async function RoleInfo({role}: {role: RoleLight}) {
	const roleFull = await role.fill();

	return (
		<div className="flex justify-between">
			<div>{roleFull.name}</div>
			<div>{roleFull.address}</div>
			<div>{roleFull.owners.length}</div>
		</div>
	)
}
