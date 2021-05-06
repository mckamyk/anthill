import {task} from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import {HardhatUserConfig} from 'hardhat/config';
import {HardhatNetworkHDAccountsUserConfig} from 'hardhat/types';
import 'hardhat-typechain';
import 'hardhat-watcher';
import * as fs from 'fs';
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
  await hre.run('compile');
  await hre.run('init');

  // start concurrent
  const nodeProm =  hre.run('node');
  const watchProm = hre.run('watch', {watcherTask: 'rebuild'});
  await Promise.all([nodeProm, watchProm]);
});

task('init', 'Initializes the contract state, and updates address reference', async (args, hre) => {
  const Greeter = await hre.ethers.getContractFactory('Greeter');
  const greeter = await Greeter.deploy('Hello, world!');
  
  await greeter.deployed();

  const data = JSON.stringify({address: greeter.address})

  fs.writeFileSync(path.join(__dirname, 'gui', 'address.json'), data);
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
