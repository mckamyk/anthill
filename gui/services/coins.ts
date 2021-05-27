import erc20Contracts, {ICoinContract} from '@metamask/contract-metadata';
import {BigNumber, Contract} from 'ethers';
import {getCons} from './ethers';
import contractAddresses from '../address.json';
import checkerAbi from '#contracts/CheckBalances.sol/Checker.json';
import {Checker} from '../types/Checker';

export interface ICoin extends ICoinContract {
  address: string;
}

export interface ICoinBalance extends ICoin{
  balance: BigNumber;
  error?: boolean;
}

export const getAllBalances = async (targetAddress?: string): Promise<ICoinBalance[]> => {
  const {signer} = getCons();
  const checker = new Contract(contractAddresses.checker, checkerAbi.abi as any, signer) as Checker;
  const address = targetAddress || await signer.getAddress();

  const coinsToSelect = ['DAI', 'aWETH'];
  const selected = Object.entries(erc20Contracts).filter(([address, coin]) => {
    if (coinsToSelect.includes(coin.symbol)) return true;
  }).map(([address, coin]) => {
    return {address, ...coin} as ICoin;
  });

  const extra = Object.entries(erc20Contracts).slice(0, 10).map(([address, coin]) => {
    return {address, ...coin} as ICoin;
  });
  selected.push(...extra);
  const tokens = selected.map((coin) => coin.address);
  const balances = await checker.getBalances(address, tokens);

  return balances.map(({addr, balance, error}) => {
    const coin = erc20Contracts[addr];
    return {address: addr, balance, error, ...coin};
  });
};
