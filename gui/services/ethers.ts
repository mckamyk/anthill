import {ethers, providers, Signer} from 'ethers';
import {routeTo} from './Router';


let provider: providers.Web3Provider;
let signer: Signer;

interface ethWindow extends Window {
  ethereum: any;
}

declare let window: ethWindow;

export const isConnected = async (): Promise<boolean> => {
  return (await provider.listAccounts()).length > 0 || false;
};

export const connect = async () => {
  await window.ethereum.request({method: 'eth_requestAccounts'});
  softConnect();
};

export const softConnect = () => {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
};

export const getDetails = () => {
  return { signer, provider };
}

export const getBalance = async () => {
  if (!isConnected()) return;
  return signer.getBalance();
};

window.ethereum.on('accountsChanged', (accounts: any) => {
  if (accounts.length === 0) {
    routeTo('/login');
  }
});

export const getCons = () => {
  return {provider, signer};
};
