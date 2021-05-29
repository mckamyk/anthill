import {extendEnvironment, task} from 'hardhat/config';
// import {task} from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import {HardhatUserConfig} from 'hardhat/config';
import {HardhatNetworkHDAccountsUserConfig} from 'hardhat/types';
import 'hardhat-typechain';
import 'hardhat-watcher';
import 'hardhat-ethernal';

import fs from 'fs';
import path from 'path';
import {Contract} from '@ethersproject/contracts';

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
        hre.ethernal.startListening().then(res);
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
  if ((await signer.getBalance()).lt(ethers.utils.parseEther('100'))) {
    const internalAccounts = await ethers.getSigners();
    await internalAccounts[0].sendTransaction({to: walletAddress, value: ethers.utils.parseEther('100')});
  }

  const HomeFactory = await ethers.getContractFactory('Home', signer);
  const CheckerFactory = await ethers.getContractFactory('Checker', signer);

  const deploys: Promise<Contract>[] = [
    HomeFactory.deploy(),
    CheckerFactory.deploy('0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'),
  ];
  const [home, checker] = await Promise.all(deploys);

  const ethernalPushes: Promise<void>[] = [
    hre.ethernal.push({
      name: 'Home',
      address: home.address,
    }),
    hre.ethernal.push({
      name: 'Checker',
      address: checker.address,
    }),
  ];

  const out = {address: home.address, checker: checker.address};
  fs.writeFileSync(path.join(__dirname, 'gui', 'address.json'), JSON.stringify(out));

  await Promise.all(ethernalPushes);
});

extendEnvironment((hre) => {
  hre.ethernalWorkspace = 'Anthill';
  hre.ethernalSync = true;
  hre.ethernalTrace = true;
});

const config: Config = {
  solidity: '0.8.3',
  networks: {
    hardhat: {
      chainId: 14,
      forking: {
        url: 'https://eth-mainnet.alchemyapi.io/v2/V0nBEYPNRBYaZmLGh9psiWwTDwGEXlk7',
        blockNumber: 12510005,
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
