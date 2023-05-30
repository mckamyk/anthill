import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LogOut from "@/components/logOut";
import { prettyAddress } from "@/tools/address";
import { getServerSession } from "next-auth";

export default function HeaderBar() {
	return (
		<div className="w-full p-2 fixed">
			<div className="p-2 shadow-lg rounded-lg bg-slate-700 flex items-center justify-between border-2 border-sky-700 bg-opacity-50">
				<div className="text-lg font-extrabold">Anthill</div>
				<div className="flex items-center gap-2">
					{/* @ts-expect-error */}
					<AddressPill />
					<LogOut />
				</div>
			</div>
		</div>
	)
}

async function AddressPill() {
	const session = await getServerSession(authOptions)
	const address = session?.address;

	return (
		<div className="px-2 py-1 bg-slate-700 rounded-lg">{prettyAddress(address || "0x0")}</div>
	)
}