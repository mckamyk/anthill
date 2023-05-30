import CreateRegsitry from "./createRegistry";
import { redirect } from "next/navigation";
import { prettyAddress } from "@/tools/address";
import Link from "next/link";
import Card from "@/components/Card";
import { getSession } from "@/tools/session";
import { getRegistryFull } from "@/contracts/Registry";
import { getFactoryAddress, getRegistries } from "@/contracts/Factory";

export default async function Home() {
  const session = await getSession();
  if (!session) redirect("/login")
  const registries = await getRegistries();
  const factoryAddress = await getFactoryAddress();

  return (
    <div className="flex items-center justify-center pt-0">
      {
        registries.length === 0 ? <CreateRegsitry factoryAddress={factoryAddress} /> : (
          <div className="flex items-center justify-center gap-2">
            {registries.map(r => (
              <Card>
                {/* @ts-ignore */}
                <RegistryButton key={r.address} address={r.address} />
              </Card>
            ))}
          </div>
        )
      }
    </div>
  )
}

const RegistryButton = async ({address}: {address: `0x${string}`}) => {
  const reg = await getRegistryFull(address);
  return (
    <Link
      href={`/${address}`}
    >
      <div>{reg.name}</div>
      <div>{prettyAddress(address)}</div>
      <div>Owner: {prettyAddress(reg.owner)}</div>
      <div>{reg.roles.map(role => (
        <Card key={role.address}>
          <div>{role.name}</div>
          <div>{role.address}</div>
          <div>{role.owners}</div>
        </Card>
      ))}</div>
    </Link>
  )
}
