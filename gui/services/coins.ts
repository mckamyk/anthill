import erc20Contracts from '@metamask/contract-metadata';
import {BigNumber, Contract} from 'ethers';
import {getCons} from './ethers';

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

export const getAllBalances = async (targetAddress?: string) => {
  const {signer} = getCons();
  const checker = new Contract(checkerAddress, checkerAbi, signer);
  const address = targetAddress || await signer.getAddress();
  const tokens = Object.keys(erc20Contracts);

  const balances = await checker.functions.balances([address], tokens.slice(1));
  console.log(balances);
};

const checkerAddress = '0xb1f8e55c7f64d203c1400b9d8555d050f94adf39';
const checkerAbi = [
  {
    'payable': true,
    'stateMutability': 'payable',
    'type': 'fallback',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': 'user',
        'type': 'address',
      },
      {
        'name': 'token',
        'type': 'address',
      },
    ],
    'name': 'tokenBalance',
    'outputs': [
      {
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': 'users',
        'type': 'address[]',
      },
      {
        'name': 'tokens',
        'type': 'address[]',
      },
    ],
    'name': 'balances',
    'outputs': [
      {
        'name': '',
        'type': 'uint256[]',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
];
