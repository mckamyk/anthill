import {extendEnvironment, task} from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import {HardhatUserConfig} from 'hardhat/config';
import {HardhatNetworkHDAccountsUserConfig} from 'hardhat/types';
import 'hardhat-typechain';
import 'hardhat-watcher';
import 'hardhat-ethernal';

import {Home} from './gui/types';
import fs from 'fs';
import path from 'path';

interface Config extends HardhatUserConfig {
  accounts?: HardhatNetworkHDAccountsUserConfig;
  watcher?: {
    [key: string]: {
      tasks?: string[];
      files?: string[];
      verbose?: boolean;
    }
  }
  typechain?: {
    outDir?: string;
  }
}

task('dev', 'Main development task', async (args, hre) => {
  // start parallel
  const nodeProm = hre.run('node');
  const watchProm = hre.run('watch', {watcherTask: 'rebuild'});

  const waitForEthernal = async () => {
    return new Promise<void>((res, rej) => {
      if (!hre.ethernal) {
        setTimeout(waitForEthernal, 100);
      } else {
        res();
      }
    });
  };

  await waitForEthernal();

  // start series
  await hre.run('compile');
  await hre.run('init');

  await Promise.all([nodeProm, watchProm]);
});

task('init', 'Initializes the contract state, and updates address reference', async (args, hre) => {
  const {ethers} = hre;

  const walletAddress = '0xAB82910FE0a55E4Aa680DBc08bae45113566c309';
  hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [walletAddress],
  });

  const signer = ethers.provider.getSigner(walletAddress);
  const internalAccounts = await ethers.getSigners();
  await internalAccounts[0].sendTransaction({to: walletAddress, value: ethers.utils.parseEther('100')});

  const HomeFactory = (await ethers.getContractFactory('Home')).connect(signer);
  const Home = await HomeFactory.deploy() as Home;
  await hre.ethernal.push({
    name: 'Home',
    address: Home.address,
  });
  const out = {address: Home.address};
  console.log(`Deployed Home to ${Home.address}`);
  fs.writeFileSync(path.join(__dirname, 'gui', 'address.json'), JSON.stringify(out));
});

extendEnvironment((hre) => {
  hre.ethernalWorkspace = 'Hardhat';
});

const config: Config = {
  solidity: '0.8.3',
  networks: {
    hardhat: {
      chainId: 14,
      forking: {
        url: 'https://eth-mainnet.alchemyapi.io/v2/V0nBEYPNRBYaZmLGh9psiWwTDwGEXlk7',
      },
    },
  },
  watcher: {
    rebuild: {
      tasks: ['compile', 'init'],
    },
  },
  typechain: {
    outDir: 'gui/types',
  },
};

export default config;
