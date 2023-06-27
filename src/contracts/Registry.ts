import { registryABI, safeABI } from '@/generated'
import { Address, getContract, zeroAddress } from 'viem'
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
		.then(rs => rs
			.filter(v => v.addr !== zeroAddress)
			.map(r => ({ name: r.name, address: r.addr, fill: () => getRole(r.name, r.addr) })))
	const vaults = contract.read.getVaults()
		.then(vs => vs
			.filter(v => v.addr !== zeroAddress)
			.map(v => ({ name: v.name, address: v.addr, fill: () => getVault(v.name, v.addr) })))

	return {
		address,
		name: await contract.read.name(),
		owner: await contract.read.owner(),

		roles: await roles,
		vaults: await vaults,
		fill: () => getRegistryFull(address)
	}
}

export const getRegistryFull = async (address: Address): Promise<RegistryFull> => {
	const registry = getRegsitryContract(address);

	const roles = registry.read.getRoles()
		.then(rs => rs.filter(r => r.addr !== zeroAddress))
		.then(rs => Promise.all(rs.map(r => getRole(r.name, r.addr))))
	const vaults = registry.read.getVaults()
		.then(vs => vs.filter(v => v.addr !== zeroAddress))
		.then(vs => Promise.all(vs.map(v => getVault(v.name, v.addr))))

	console.log(vaults)


	return {
		address,
		name: await registry.read.name(),
		owner: await registry.read.owner(),

		roles: await roles,
		vaults: await vaults
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

const getVault = async (name: string, address: Address): Promise<RoleFull> => {
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
	vaults: VaultLight[];

	fill: () => Promise<RegistryFull>
}

export interface RegistryFull extends Registry {
	roles: RoleFull[];
	vaults: VaultFull[];
}

export interface Role {
	name: string;
	address: Address;
}

export interface RoleFull extends Role {
	owners: readonly Address[];
	safe: ReturnType<typeof getSafeContract>
}

export interface RoleLight extends Role {
	fill: () => Promise<RoleFull>
}

export interface Vault {
	name: string;
	address: Address;
}

export interface VaultFull extends Vault {
	owners: readonly Address[];
	safe: ReturnType<typeof getSafeContract>;
}

export interface VaultLight extends Vault {
	fill: () => Promise<VaultFull>;
}