import Web3ButtonClient from "@/components/Web3Button";
import LogOut from "@/components/logOut";
import { ReactNode } from "react";

export default function HeaderBar({children}: {children?: ReactNode}) {
	return (
		<div className="w-full p-2 fixed">
			<div className="p-2 shadow-lg rounded-lg bg-slate-800 flex items-center justify-between border-2 border-sky-700">
				<div className="text-lg font-extrabold">Anthill</div>
				<div className="flex items-center gap-2">
					{/* <Web3ButtonClient /> */}
					<LogOut />
				</div>
			</div>
		</div>
	)
}