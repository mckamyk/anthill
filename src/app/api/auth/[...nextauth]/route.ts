import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials'
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
					if (!credentials) return null;
					const siwe = new SiweMessage(JSON.parse(credentials.message || "{}"))
					const nextauthUrl = new URL(process.env.NEXTAUTH_URL!);


					const result = await siwe.verify({
						signature: credentials.signature,
						domain: nextauthUrl.host,
					})

					if (result.success) {
						return {id: siwe.address}
					} 
					console.log(result)
					return null
				} catch (e) {
					console.log(e)
					return null
				}
			}
		})
	],
	callbacks: {
		async session({session, token}) {
			return {...session, user: {name: token.sub}}
		}
	}
})

export {handler as GET, handler as POST}