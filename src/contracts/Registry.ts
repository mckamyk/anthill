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

const getSafeContract = (address: Address) => {
	return getContract({
		address,
		abi: safeABI,
		publicClient
	})
}

export const getRegistryLight = async (address: Address): Promise<RegistryLight> => {
	const contract = getRegsitryContract(address);
	const roles = contract.read.getRoles()
		.then(roles => roles.map(r => r.addr))

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

const getRole = async (name: string, address: Address): Promise<Role> => {
	const safe = getSafeContract(address);

	return {
		name,
		address,
		owners: await safe.read.getOwners(),
	}
}

interface Registry {
	address: Address
	name: string
	owner: Address
}

interface RegistryLight extends Registry {
	roles: Address[];

	fill: () => Promise<RegistryFull>
}

interface RegistryFull extends Registry {
	roles: Role[];
}

interface Role {
	name: string;
	address: Address
	owners: readonly Address[];
}

interface RoleLight {
	name: string;
	address: Address
}