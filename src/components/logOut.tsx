'use client'
import { signOut } from "next-auth/react"

export default function LogOut() {
	return (
		<button className="p-1 rounded-md bg-red-600" onClick={() => signOut({callbackUrl: `${window.location.host}/login`})}>Log Out</button>
	)
}