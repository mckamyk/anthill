import {task} from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import {HardhatUserConfig} from 'hardhat/config';
import {HardhatNetworkHDAccountsUserConfig, HardhatRuntimeEnvironment} from 'hardhat/types';
import 'hardhat-typechain';
import 'hardhat-watcher';

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

task('dev', 'Main development task', async (args, hre: HardhatRuntimeEnvironment) => {
  // start parallel
  const watchProm = hre.run('watch', {watcherTask: 'rebuild'});

  // start series
  hre.run('node');
  await hre.run('compile');
  await hre.run('init');

  await Promise.all([watchProm]);
});

task('init', 'Initializes the contract state, and updates address reference', async (args, hre: HardhatRuntimeEnvironment) => {
  const {ethers} = hre;

  const walletAddress = '0xAB82910FE0a55E4Aa680DBc08bae45113566c309';
  hre.network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [walletAddress],
  });

  const signer = ethers.provider.getSigner(walletAddress);
  const balance = await signer.getBalance();
  console.log('Main Wallet: ' + ethers.utils.formatEther(balance));
  if (balance.lt(ethers.utils.parseEther('100'))) {
    const internalAccounts = await ethers.getSigners();
    const internalBalance = await internalAccounts[0].getBalance();
    if (internalBalance.gte(100)) {
      console.log('refilling main wallet');
      console.log();
      console.log('Internal Account: ' + ethers.utils.formatEther(await internalAccounts[0].getBalance()));
      console.log();
      await internalAccounts[0].sendTransaction({to: walletAddress, value: ethers.utils.parseEther('100')});
    };
  }

  const HomeFactory = await ethers.getContractFactory('Home', signer);
  const CheckerFactory = await ethers.getContractFactory('Checker', signer);

  const deploys: Promise<Contract>[] = [
    HomeFactory.deploy(),
    CheckerFactory.deploy('0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf'),
  ];
  const [home, checker] = await Promise.all(deploys);

  const out = {address: home.address, checker: checker.address};
  fs.writeFileSync(path.join(__dirname, 'gui', 'address.json'), JSON.stringify(out));
});

const config: Config = {
  solidity: '0.8.3',
  networks: {
    hardhat: {
      chainId: 14,
      forking: {
        url: 'https://eth-mainnet.alchemyapi.io/v2/V0nBEYPNRBYaZmLGh9psiWwTDwGEXlk7',
        blockNumber: 13000429,
      },
      logging: {
        omitMethods: ['eth_chainId', 'eth_blockNumber', 'eth_getFilterChanges'],
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
