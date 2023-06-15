import CreateRegsitry from "./create/createRegistry";
import { redirect } from "next/navigation";
import { prettyAddress } from "@/tools/address";
import Link from "next/link";
import Card from "@/components/Card";
import { getSession } from "@/tools/session";
import { RegistryLight } from "@/contracts/Registry";
import { getRegistries } from "@/contracts/Factory";
import ToastBox from "@/components/Toast";

export default async function Home() {
  const session = await getSession();
  if (!session) redirect("/login")
  const registries = await getRegistries();

  return (
    <div className="flex items-center justify-center pt-0">
      {
        registries.length === 0 ? <NoRegistry /> : (
          <div className="flex items-center justify-center gap-2">
            {registries.map(r => (
              <Card className="hover:border-sky-400">
                {/* @ts-ignore */}
                <RegistryButton key={r.address} registry={r} />
              </Card>
            ))}
          </div>
        )
      }
    </div>
  )
}

const NoRegistry = () => {
  return (
    <Card>
      <div className="text-2xl mb-4">Create your first Registry!</div>
      <div className="flex justify-center">
        <Link href="/create" className="bg-sky-800 rounded-md px-2 py-1 hover:bg-sky-600 transition-colors">
          Create Registry
        </Link>
      </div>
    </Card>
  )
}

const RegistryButton = async ({registry}: {registry: RegistryLight}) => {
  return (
    <Link
      href={`/${registry.address}`}
    >
      <div>{registry.name}</div>
      <div>{prettyAddress(registry.address)}</div>
      <div>Owner: {prettyAddress(registry.owner)}</div>
      <Card>
        Roles: {registry.roles.length}
      </Card>
    </Link>
  )
}
