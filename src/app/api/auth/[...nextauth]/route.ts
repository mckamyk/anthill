import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials'
import {getCsrfToken} from 'next-auth/react'
import {SiweMessage} from 'siwe';

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			name: 'Ethereum',
			credentials: {
				message: {
					label: "Message",
					type: "text",
					placeholder: '0x0',
				},
				signature: {
					label: "Signature",
					type: "text",
					placeholder: "0x0",
				}
			},
			async authorize(credentials, req) {
				try {
					if (!credentials) return null
					const siwe = new SiweMessage(JSON.parse(credentials.message))
					const domain = process.env.DOMAIN
					if (siwe.domain !== domain) {
						return null
					}

					console.log(req.headers)
					const csrf = await getCsrfToken({req});
					console.log(siwe.nonce, csrf)
					if (siwe.nonce !== csrf) {
						return null
					}

					const result = await siwe.verify({signature: credentials?.signature || ''})
					console.log(result)
					if (result.success) {
						return {
							id: siwe.address
						}
					}
					return null
				} catch {
					return null
				}
			}
		})
	],
	callbacks: {
		async session({session}) {
			return session
		}
	}
})

export {handler as GET, handler as POST}