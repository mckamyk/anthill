'use client'
import {useWeb3Modal, useWeb3ModalEvents} from '@web3modal/react'
import { connect } from 'http2'
import { getCsrfToken, signIn} from 'next-auth/react'
import { useEffect } from 'react'
import { SiweMessage } from 'siwe'
import { useAccount, useSignMessage} from 'wagmi'

export default function SuperLoginButton() {
	const {open} = useWeb3Modal()
	const {address, isConnected, connector} = useAccount()
	const {signMessageAsync} = useSignMessage()
	useWeb3ModalEvents(evt => evt.name === 'ACCOUNT_CONNECTED' && handleLogin());

	const handleClick = () => {
		if (isConnected) {
			handleLogin()
		} else {
			open()
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
