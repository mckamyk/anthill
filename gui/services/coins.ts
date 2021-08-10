import erc20Contracts, {ICoinContract} from '@metamask/contract-metadata';
import {BigNumber, Contract} from 'ethers';
import {getCons} from './ethers';
import contractAddresses from '../address.json';
import checkerAbi from '#contracts/Checker.sol/Checker.json';
import {Checker} from '../types/Checker';

const ETH_COIN: ICoin = {
  address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  name: 'Ether',
  decimals: 18,
  symbol: 'ETH',
  logo: '#eth',
  erc20: true,
};

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
  const tgtAddress = targetAddress || await signer.getAddress();

  const coinsToSelect = ['DAI', 'ETH'];
  const selected = Object.entries(erc20Contracts).filter(([address, coin]) => {
    return coinsToSelect.includes(coin.symbol);
  }).map(([address, coin]) => {
    return {address, ...coin} as ICoin;
  });

  selected.push(ETH_COIN);

  const extra = Object.entries(erc20Contracts).slice(0, 10).map(([address, coin]) => {
    return {address, ...coin} as ICoin;
  });
  selected.push(...extra);
  const tokens = selected.map((coin) => coin.address);
  const balances = await checker.getBalancePrices(tgtAddress, tokens);

  return balances.map(({addr, balance, error, price}) => {
    let coin: ICoinContract;
    coin = erc20Contracts[addr];
    if (addr === ETH_COIN.address) {
      coin = ETH_COIN;
    }
    return {
      address: addr,
      balance,
      error,
      price,
      ...coin,
    };
  });
};
