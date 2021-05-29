import erc20Contracts, {ICoinContract} from '@metamask/contract-metadata';
import {BigNumber, Contract} from 'ethers';
import {getCons} from './ethers';
import contractAddresses from '../address.json';
import checkerAbi from '#contracts/Checker.sol/Checker.json';
import {Checker} from '../types/Checker';

export interface ICoin extends ICoinContract {
  address: string;
}

export interface ICoinBalance extends ICoin {
  balance: BigNumber;
  error?: boolean;
}

export interface ICoinBalancePrice extends ICoinBalance {
  price: BigNumber;
}

export const getAllBalances = async (targetAddress?: string): Promise<ICoinBalancePrice[]> => {
  const {signer} = getCons();
  const checker = new Contract(contractAddresses.checker, checkerAbi.abi, signer) as Checker;
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
  const balances = await checker.getBalancePrices(address, tokens, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');

  return balances.map(({addr, balance, error, price}) => {
    const coin = erc20Contracts[addr];
    return {
      address: addr,
      balance,
      error,
      price,
      ...coin,
    };
  });
};
