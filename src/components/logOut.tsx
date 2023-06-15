'use client'
import { signOut } from "next-auth/react"
import {PowerIcon} from '@heroicons/react/20/solid'

export default function LogOut() {
	return (
		<button
			className="p-1 rounded-md transition-colors text-sky-600 hover:text-orange-700 hover:bg-slate-700 bg-opacity-50 w-[30px] h-[30px] box-content"
			onClick={() => signOut()}
		>
			<PowerIcon height={30} color="inherit"/>
		</button>
	)
}