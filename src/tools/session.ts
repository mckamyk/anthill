import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth"

export interface Session {
	address: `0x${string}`
}

export const getSession = async () => {
	return getServerSession<any, Session>(authOptions);
}