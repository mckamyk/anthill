'use client'
import { useSession } from "next-auth/react"

const Account = () => {
	const {data:session} = useSession();

	return (
		<>
			{session ? <div>{JSON.stringify(session)}</div> : 'no session'}
		</>
	)
}

export default Account