import {BigNumber, Contract} from 'ethers';
import {getDetails} from './ethers';
import {getStablecoinTransactions} from './etherscan';

export interface ICoin {
  address: string;
  decimals: number;
  name: string;
}

export interface ICoinBalance {
  name: string;
  balance: BigNumber;
  coin: ICoin;
}

export const coins: ICoin[] = [
  {
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    decimals: 18,
    name: 'Dai',
  },
  {
    address: '0x030ba81f1c18d280636f32af80b9aad02cf0854e',
    decimals: 18,
    name: 'aWeth',
  },
];

export const getAllStablecoinBalances = async () => {
  const {signer} = getDetails();
  const coins = await getStablecoinTransactions(await signer.getAddress());
  const balances = coins.map((coin) => getStablecoinBalance(coin));
  return Promise.all(balances);
};

export const getStablecoinBalance = async (coin: ICoin): Promise<ICoinBalance> => {
  const {signer} = getDetails();
  const coinContract = new Contract(coin.address, stablecoinAbi, signer);
  return {
    name: coin.name,
    balance: await coinContract.balanceOf(await signer.getAddress()),
    coin,
  };
};

export const stablecoinAbi = [
  {
    'constant': true,
    'inputs': [],
    'name': 'name',
    'outputs': [
      {
        'name': '',
        'type': 'string',
      },
    ],
    'payable': false,
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'decimals',
    'outputs': [
      {
        'name': '',
        'type': 'uint8',
      },
    ],
    'payable': false,
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '_owner',
        'type': 'address',
      },
    ],
    'name': 'balanceOf',
    'outputs': [
      {
        'name': 'balance',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'symbol',
    'outputs': [
      {
        'name': '',
        'type': 'string',
      },
    ],
    'payable': false,
    'type': 'function',
  },
];
