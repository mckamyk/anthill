import {LitElement, html, css, property} from 'lit-element';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';
import {colors} from '../../styles/global';
import erc20Contracts from '@metamask/contract-metadata';
import {ETH_COIN, getBalances, ICoin, ICoinBalancePrice} from '#services/coins';
import {BigNumber} from 'ethers';
import IconLoader from '#components/iconLoader';

const STABLE_COINS: ICoin[] = Object.entries(erc20Contracts)
    .filter(([address, coin]) => ['DAI', 'USDC', 'USDT'].includes(coin.symbol))
    .map(([address, coin]) => {
      return {address, ...coin};
    });

export default class Header extends scope(LitElement) {
  @property({attribute: false}) balances?: ICoinBalancePrice[] = [];

  connectedCallback() {
    super.connectedCallback();
    getBalances([...STABLE_COINS, ETH_COIN]).then((bals) => this.balances = bals );
  }

  getStableCoinBalance(): string {
    if (!this.balances) return '0';

    const stableAddresses = STABLE_COINS.map((coin) => coin.address);
    const total: BigNumber = this.balances.filter((coin) => stableAddresses.includes(coin.address))
        .map((coin) => coin.balance)
        .reduce((prevBal, currBal) => {
          return prevBal.add(currBal);
        }, BigNumber.from('0x0'));

    return total.toNumber().toLocaleString();
  }

  getEthBalance(): BigNumber {
    if (!this.balances) return BigNumber.from('0x0');

    const eth = this.balances.find((coin) => coin.address === ETH_COIN.address);
    if (!eth) return BigNumber.from('0x0');

    return eth.balance.div(BigNumber.from('0xa').pow(eth.decimals));
  }

  getEthValue(): BigNumber {
    const bal = this.getEthBalance();
    if (!bal || !this.balances) return BigNumber.from('0x0');

    const eth = this.balances.find((coin) => coin.address === ETH_COIN.address);
    if (!eth) return BigNumber.from('0x0');

    return bal.mul(eth.price);
  }

  getFormattedEthBalance() {
    const bal = this.getEthBalance();
    return bal?.toNumber().toLocaleString();
  }

  getFormattedEthValue() {
    const val = this.getEthValue();
    return val?.toNumber().toLocaleString();
  }

  render() {
    return html`
      <div class="header">
        <div class="eth">
          <icon-loader class="icon" location="#eth"></icon-loader>
          <span class="bal">${this.getFormattedEthBalance()} eth</span>
          <span class="div"> | </span>
          <span class="val">$ ${this.getFormattedEthValue()}</span>
        </div>
        <div class="stable">
          <icon-loader class="icon" location="#stable"></icon-loader>
          <span class="bal">$ ${this.getStableCoinBalance()}</span>
        </div>
      </div>
    `;
  }

  static styles = [colors, css`
    .header {
      position: sticky;
      display: flex;
      width: 100vw;
      align-items: center;
      justify-content: flex-end;
      background-color: var(--low);
      padding: .25rem;
    }
    .icon::part(wrapper) {
      height: 30px;
      width: 30px;
    }
    .eth, .stable {
      display: flex;
      align-items: center;
      min-width: 5rem;
    }
    .stable > .bal {
      margin-left: .5rem;
    }
    .eth {
      margin-right: .5rem;
    }
    .div {
      margin: 0 0.5rem;
    }
  `];

  static get scopedElements() {
    return {
      'icon-loader': IconLoader,
    };
  }
}
