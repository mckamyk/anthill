import Card from "@/components/Card"
import { getRegistryLight } from "@/contracts/Registry"
import { prettyAddress } from "@/tools/address"
import { getSession } from "@/tools/session"
import { signOut } from "next-auth/react"
import { Address } from "viem"
import RoleInfo from "./RoleInfo/page"
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
			<div className="w-1/2">
				<div className="flex justify-center my-10">
					<div className="w-1/2 flex justify-between gap-2">
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
			</div>

				<div className="grid grid-cols-1 2xl:grid-cols-2 gap-2">
					<Card>
						Roles:
						<div>
							{regLight.roles.map(r => (
								<div key={r.address}>
									{/* @ts-expect-error Server Component */}
									<RoleInfo role={r} allRoles={regLight.roles} />
								</div>
							))}
						</div>
					</Card>

					<Card>
						Vaults:
						<div>
							{regLight.vaults.map(r => (
								<div key={r.address}>
									{/* @ts-expect-error */}
									<RoleInfo role={r} />
								</div>
							))}
						</div>
					</Card>
				</div>
			</div>
		</div>
	)
}