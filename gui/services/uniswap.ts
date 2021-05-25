import {ChainId, Token, Fetcher, Route} from '@uniswap/sdk';
import {ICoin, coins} from './coins';

const daiAddress = coins.find((coin) => coin.name === 'Dai')?.address;

if (!daiAddress) throw new Error('Dai token not found in list');

const DAI = new Token(ChainId.MAINNET, daiAddress, 18);

export const getValueOf = async (coin: ICoin): Promise<string> => {
  if (coin.name === 'Dai') return '1.00';
  const tok = new Token(ChainId.MAINNET, coin.address, coin.decimals);
  const pair = await Fetcher.fetchPairData(DAI, tok);
  const route = new Route([pair], tok);
  return route.midPrice.toFixed(2);
};
