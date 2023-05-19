import { getServerSession } from "next-auth";
import CreateRegsitry from "./createRegistry";
import { getRegistries, getRegsitryFactoryAddress } from "./test"
import { authOptions } from "../api/auth/[...nextauth]/route";

interface Session {
  address: `0x${string}`
}

export default async function Home() {
  const session = await getServerSession<any, Session>(authOptions);
  if (!session) throw new Error("No session");
  const registries = await getRegistries(session.address);
  const factoryAddress = await getRegsitryFactoryAddress();

  return (
    <div className="flex h-full items-center justify-center">
      <div className="p-2 rounded-lg shadow-lg bg-slate-700">
        {
          registries.length === 0 ? <CreateRegsitry factoryAddress={factoryAddress} /> : (
            <div>
              Registries:
              <div>{registries.map(r => <div key={r.name}>{r.name}</div>)}</div>
            </div>
          )
        }
      </div>
    </div>
  )
}
