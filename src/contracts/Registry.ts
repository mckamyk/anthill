import { registryABI, safeABI } from '@/generated'
import { Address, getContract } from 'viem'
import { publicClient } from './clients'


const getRegsitryContract = (address: Address) => {
	return getContract({
		abi: registryABI,
		address,
		publicClient
	})
}

export const getSafeContract = (address: Address) => {
	return getContract({
		address,
		abi: safeABI,
		publicClient
	})
}

export const getRegistryLight = async (address: Address): Promise<RegistryLight> => {
	const contract = getRegsitryContract(address);
	const roles = contract.read.getRoles()
		.then(roles => roles.map(r => ({ name: r.name, address: r.addr, fill: () => getRole(r.name, r.addr) })))

	return {
		address,
		name: await contract.read.name(),
		owner: await contract.read.owner(),

		roles: await roles,
		fill: () => getRegistryFull(address)
	}
}

export const getRegistryFull = async (address: Address): Promise<RegistryFull> => {
	const contract = getRegsitryContract(address);
	const roles = contract.read.getRoles()
		.then(rs => Promise.all(rs.map(r => getRole(r.name, r.addr))))

	return {
		address,
		name: await contract.read.name(),
		owner: await contract.read.owner(),

		roles: await roles
	}
}

const getRole = async (name: string, address: Address): Promise<RoleFull> => {
	const safe = getSafeContract(address);

	return {
		name,
		address,
		// owners: await safe.read.getOwners(),
		owners: [],
		safe,
	}
}

interface Registry {
	address: Address
	name: string
	owner: Address
}

export interface RegistryLight extends Registry {
	roles: RoleLight[];

	fill: () => Promise<RegistryFull>
}

export interface RegistryFull extends Registry {
	roles: Role[];
}

export interface Role {
	name: string;
	address: Address
}

export interface RoleFull extends Role {
	owners: readonly Address[];
	safe: ReturnType<typeof getSafeContract>
}

export interface RoleLight extends Role {
	fill: () => Promise<RoleFull>
}