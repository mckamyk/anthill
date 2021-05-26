
declare module '@metamask/contract-metadata' {
  interface Contracts {
    [key: string]: {
      name: string;
      logo: string;
      erc20: boolean;
      symbol: string;
      decimals: number;
    }
  }

  const contracts: Contracts;
  export default contracts;
}

