import {Home} from '../types';
import {abi} from '#contracts/Home.sol/Home.json';
import {address} from '../address.json';
import {Contract, ContractTransaction} from 'ethers';
import {getDetails} from '#services/ethers';

export const getContract = () => {
  const {signer} = getDetails();
  return new Contract(address, abi, signer) as Home;
};

export const getOwner = async (): Promise<string> => getContract().owner();

export const getMessage = async (): Promise<string> => getContract().message();

export const setMessage = async (message: string): Promise<ContractTransaction> => getContract().setMessage(message);
