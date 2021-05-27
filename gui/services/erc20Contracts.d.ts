
declare module '@metamask/contract-metadata' {


  export interface ICoinContract {
    name: string;
    logo: string;
    erc20: boolean;
    symbol: string;
    decimals: number;
  }

  interface ICoinCollection {
    [key: string]: ICoinContract;
  }

  const contracts: ICoinCollection;
  export default contracts;
}

