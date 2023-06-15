"use client"

import { useSafeEncodeTransactionData, useSafeWrite } from "@/generated";
import { useAccount } from "wagmi";

export default function TestWrite() {
	const { address } = useAccount();
	const {} = useSafeWrite({
		address: "0x0",
	})

	return (
		<div>hi</div>
	)
}