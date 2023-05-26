"use client"
import LogOut from "@/components/logOut";
import { useAccount } from "wagmi";
import { prettyAddress } from "@/tools/address";

export default function HeaderBar() {
	const {address} = useAccount();

	return (
		<div className="w-full p-2 fixed">
			<div className="p-2 shadow-lg rounded-lg bg-slate-800 flex items-center justify-between border-2 border-sky-700">
				<div className="text-lg font-extrabold">Anthill</div>
				<div className="flex items-center gap-2">
					{address && <div className="px-2 py-1 bg-slate-700 rounded-lg">{prettyAddress(address)}</div>}
					<div></div>
					<LogOut />
				</div>
			</div>
		</div>
	)
}