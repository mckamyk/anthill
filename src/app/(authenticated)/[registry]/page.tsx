import Card from "@/components/Card"
import { getRegistryLight } from "@/contracts/Registry"
import { prettyAddress } from "@/tools/address"
import { getSession } from "@/tools/session"
import { signOut } from "next-auth/react"
import { Address } from "viem"
import RoleInfo from "./RoleInfo"
import AddressChip from "@/components/AddressChip"

export default async function Registry({
	params: {registry}
}: {
	params: {
		registry: Address
	}
}) {
	const regLight = await getRegistryLight(registry)
	const session = await getSession();
	if (!session) signOut();

	return (
		<div className="flex justify-center">
			<Card className="w-1/2">
				<div className="flex justify-between">
					<div>
						<div className="text-xl">{regLight.name}</div>
						<div><AddressChip address={regLight.address} /></div>
					</div>
					<div>
						<div className="text-sm">Address:</div>
						<div>{prettyAddress(regLight.address)}</div>
					</div>
				</div>

				<div className="flex justify-end">
					<div>
						<div className="text-sm">Owner:</div>
						<div>{regLight.owner === session?.address ? "Me" : prettyAddress(regLight.owner)}</div>
					</div>
				</div>

				<Card>
					Roles:
					<div>
						{regLight.roles.map(r => (
							<div key={r.address}>
								{/* @ts-expect-error */}
								<RoleInfo role={r} />
							</div>
						))}
					</div>
				</Card>
			</Card>
		</div>
	)
}