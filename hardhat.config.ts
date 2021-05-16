import {task} from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import {HardhatUserConfig} from 'hardhat/config';
import {HardhatNetworkHDAccountsUserConfig} from 'hardhat/types';
import 'hardhat-typechain';
import 'hardhat-watcher';
import * as fs from 'fs';
import path from 'path';
import { ethers } from 'hardhat';

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
  await hre.run('compile');
  await hre.run('init');

  // start concurrent
  const nodeProm =  hre.run('node');
  const watchProm = hre.run('watch', {watcherTask: 'rebuild'});
  await Promise.all([nodeProm, watchProm]);
});

task('init', 'Initializes the contract state, and updates address reference', async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  const {ethers} = hre;
  const [primary, ...rest] = accounts;

  const transactions = rest.map(async (addy) => {
    primary.sendTransaction({
      to: addy.address,
      value: ethers.utils.parseEther('123')
    })
  })

  await Promise.all(transactions);
})

const config: Config = {
  solidity: '0.8.3',
  accounts: {
    mnemonic: 'test test test test test test test test test test test junk',
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
