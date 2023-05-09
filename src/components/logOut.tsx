'use client'
import { signOut } from "next-auth/react"
import {PowerIcon} from '@heroicons/react/20/solid'

export default function LogOut() {
	return (
		<button className="p-1 rounded-md bg-red-400 bg-opacity-50 w-[30px] h-[30px] box-content" onClick={() => signOut()}><PowerIcon height={30}/></button>
	)
}