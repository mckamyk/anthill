"use client"
import { Address } from "wagmi"
import { useToast } from "./Toast"
import CopyIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon'

interface AddressChipProps {
	address: Address;
	small?: boolean
}

export default function AddressChip({address, small}: AddressChipProps) {
	const {addInfoToast} = useToast()

	const copy = () => {
		navigator.clipboard.writeText(address)
		addInfoToast({title: "Copied", message: `${address} copied to clipboard`})
	}

	return (
		<div onClick={copy} className="rounded-md border border-slate-300 hover:bg-slate-600 focus:bg-slate-400 text-sm px-2 py-1 cursor-pointer transition-colors">
			<div className="flex items-center">
				{address.slice(0, 6)}
				<CopyIcon className="inline pl-1" height={12} />
			</div>
		</div>
	)
}