import {ICoin, coins} from './coins';

const apiKey = 'ES371YGDNIPE42EA79NH9Z5GBAKTZ59RB9';

export const getTransactions = async (address: string): Promise<IEtherscanTransaction[]> => {
  const resp = fetch('https://api.etherscan.io/api?' + new URLSearchParams({
    apiKey,
    module: 'account',
    action: 'txlist',
    address,
    sort: 'asc',
  })).then((r) => r.json());

  return (await resp).result;
};

export const getStablecoinTransactions = async (address: string): Promise<ICoin[]> => {
  const alltx = await getTransactions(address);
  const coinAddresses = coins.map((coin) => coin.address);
  const included = alltx.filter((tx) => coinAddresses.includes(tx.to)).map((tx) => tx.to);
  const filteredCoins = coins.filter((coin) => included.includes(coin.address));
  return filteredCoins;
};


export interface IEtherscanTransaction {
  blockHash: string;
  blockNumber: string;
  confirmations: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  from: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  hash: string;
  input: string;
  isError: string;
  nonce: string;
  timestamp: string;
  to: string;
  transactionIndex: string;
  'txreceipt_status': string;
  value: string;
}
