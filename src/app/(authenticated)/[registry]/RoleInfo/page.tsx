import AddressChip from "@/components/AddressChip";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { RoleLight } from "@/contracts/Registry";
import { getSafeOwners } from "@/contracts/Safe";
import { getSession } from "@/tools/session";
import { redirect } from "next/navigation";
import { isAddress } from "viem";

interface RoleProps {
	role: RoleLight;
	allRoles: RoleLight[];
}

const RoleInfo = async ({role, allRoles}: RoleProps) => {
	const session = await getSession()
	if (!session) return redirect("/")
	const owners = await getSafeOwners(role.address);
	const namedOwners = owners.map(o => allRoles.find(r => r.address === o)?.name || "me")

	const namedTags = namedOwners.map((o, i) => {
		if (o === "me") return <div key={i} className="text-xs border rounded-md p-1 border-green-500 text-green-500">Me</div>
		if (isAddress(o)) return <AddressChip address={o} />
		return <div key={i} className="text-xs border rounded-md p-1 border-sky-700 text-sky-700">Me</div>
	})

	return (
		<Card>
			<div>
				<div>
					<div>Roles:</div>
					<div><Button onClick={console.log}>Create</Button></div>
				</div>
				<div className="flex justify-between">
					<div className="flex">
							{role.name}
							<AddressChip address={role.address} />
					</div>
					<div>{...namedTags}</div>
				</div>
			</div>
		</Card>
	)
}
	
export default RoleInfo