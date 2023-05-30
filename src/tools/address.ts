export const prettyAddress = (address: `0x${string}`) => {
	return `${address.slice(0, 6)}...${address.slice(-4)}`
}