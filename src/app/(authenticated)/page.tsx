import { getServerSession } from "next-auth";
import CreateRegsitry from "./createRegistry";
import { getRegistries, getRegsitryFactoryAddress } from "./test"
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prettyAddress } from "@/tools/address";
import Link from "next/link";
import Card from "@/components/Card";

interface Session {
  address: `0x${string}`
}

export default async function Home() {
  const session = await getServerSession<any, Session>(authOptions);
  if (!session) redirect("/login")
  const registries = await getRegistries(session.address);
  const factoryAddress = await getRegsitryFactoryAddress();

  return (
    <div className="flex items-center justify-center pt-0">
      {
        registries.length === 0 ? <CreateRegsitry factoryAddress={factoryAddress} /> : (
          <div className="flex items-center justify-center gap-2">
            {registries.map(r => (
              <Card>
                <RegistryButton key={r.address} name={r.name} address={r.address} />
              </Card>
            ))}
          </div>
        )
      }
    </div>
  )
}

interface RegistryButtonProps {
  name: string
  address: `0x${string}`
}

const RegistryButton = ({name, address}: RegistryButtonProps) => {
  return (
    <Link
      href={`/${address}`}
    >
      <div>{name}</div>
      <div>{prettyAddress(address)}</div>
    </Link>
  )
}
