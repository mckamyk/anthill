import NextAuth from 'next-auth/react';

declare module "next-auth" {
	interface Session {
		address: `0x${string}`;
	}
}