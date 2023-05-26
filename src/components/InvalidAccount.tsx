import { prettyAddress } from '@/tools/address';
import Exlaimation from '@heroicons/react/24/solid/ExclamationTriangleIcon'
import {signOut} from 'next-auth/react';

interface InvalidAccountProps {
	sessionAddress?: `0x${string}`;
	connectedAddress?: `0x${string}`;
}

export default function InvalidAccount({sessionAddress, connectedAddress}: InvalidAccountProps) {
	return (
		<div className="fixed left-0 right-0 w-screen h-screen flex items-center justify-center bg-slate-950 bg-opacity-80">
			<div className="from-sky-950 to-sky-900 bg-gradient-to-tr p-4 rounded-lg">
				<div className="flex justify-center items-center flex-col">
					<div className="text-lg font-bold text-orange-700">Invalid Account</div>
					<Exlaimation height={80} width={80} className="text-orange-700 text-center" />
				</div>
				<p className="text-center">It looks like you may have changed accounts while signed in.</p>
				<p className="text-center">Please either switch to correct account (<strong>{prettyAddress(sessionAddress || "0x0")}</strong>) or <SignOut /></p>
			</div>
		</div>
	)
}

const SignOut = () => {
	"use client"
	return (
		<button className="inline underline text-sky-700" onClick={() => signOut()}>sign out.</button>
	)
}