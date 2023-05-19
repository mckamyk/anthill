"use client"
import {useConnect, useAccount, useSignMessage, Connector} from 'wagmi';
import {useSession, getCsrfToken, signIn} from 'next-auth/react';
import { useEffect, useState } from 'react';
import { SiweMessage } from 'siwe';

export default function LoginButton() {
	const {address, isConnected} = useAccount();
	const {connect, connectors} = useConnect();
	const [showModal, setShowModal] = useState(false);
	const [nonce, setNonce] = useState<string>();
	const {signMessageAsync} = useSignMessage();

	const handleConnect = async (connector: Connector) => {
		connect({connector});
	}

	const handleLogin = async () => {
		const message = new SiweMessage({
			domain: window.location.host,
			address,
			statement: "Sign in to Anthill",
			uri: window.location.origin,
			version: "1",
			nonce,			
		})
		const signature = await signMessageAsync({
			message: message.prepareMessage()
		})
		signIn("credentials", {
			message: JSON.stringify(message),
			signature, 
			callbackUrl: "/"
		})
	}

	useEffect(() => {
		getCsrfToken().then(setNonce);
	}, [])

	useEffect(() => {
		if (isConnected && showModal) setShowModal(false);
	}, [isConnected, setShowModal, showModal])

	const handleClick = () => {
		if (isConnected) {
			handleLogin()
		} else {
			setShowModal(true)
		}
	}


	return (
		<>
			<button onClick={handleClick}>Login</button>

			{showModal && (
				<div onClick={() => setShowModal(false)} className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex z-10 items-center justify-center">
					<div onClick={e => e.stopPropagation()} className="bg-slate-700 p-4 rounded-lg shadow-lg">
						<div className="font-extrabold text-lg mb-4 text-center">Select a wallet</div>

						<div className="flex flex-col gap-2 w-[350px]">
							{connectors.map(connector => (
								<button onClick={() => handleConnect(connector)} className="text-center py-2 w-full bg-slate-800">{connector.name}</button>
							))}
						</div>
					</div>
				</div>
			)}
		</>
	)
}