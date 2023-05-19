'use client'
import { getCsrfToken, signIn} from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { useAccount, useConnect, useSignMessage} from 'wagmi'

export default function SuperLoginButton() {
	const {address, isConnected, connector} = useAccount()
	const {signMessageAsync} = useSignMessage()
	const {connect, connectors, error, isLoading, pendingConnector} = useConnect();

	const handleClick = () => {
		if (isConnected) {
			handleLogin()
		} else {
		}
	}

	const handleLogin = async () => {
		try {
			const callbackUrl = "/"
			const message = new SiweMessage({
				domain: window.location.host,
				address: address,
				statement: "Sign in with Ethereum",
				uri: window.location.origin,
				version: "1",
				nonce: await getCsrfToken()
			})
			const signature = await signMessageAsync({
				message: message.prepareMessage()
			})
			signIn("credentials", {
				message: JSON.stringify(message),
				signature, callbackUrl
			})
		} catch (error) {
			window.alert(error)
		}
	}

	return (
		<button className="bg-sky-800 rounded-md p-2" onClick={handleClick}>Log In with Ethereum</button>
	)
}
