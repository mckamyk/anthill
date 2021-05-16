import {Home} from '../types';
import {abi} from '#contracts/Home.sol/Home.json';
import {address} from '../address.json';
import {Contract} from 'ethers';
import {getDetails} from '#services/ethers';

const getContract = () => {
  const {signer} = getDetails();
  return new Contract(address, abi, signer) as Home;
}

export const getOwner = async (): Promise<string> => getContract().owner();