import {LitElement, html, css, property} from 'lit-element';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';
import {getAllBalances, ICoinBalancePrice} from '#services/coins';
import {BigNumber} from '@ethersproject/bignumber';
import {ethers} from 'ethers';

import Card from '#components/card';
import IconLoader from '#components/iconLoader';
import Selector, {ItemIcon} from '#components/selector';
import {addresses, icons} from '#services/constants';

interface Demoninator {
  item: ItemIcon,
  address: string;
}

const denoms: Demoninator[] = [
  {
    item: {
      icon: icons.eth,
      item: 'Eth',
    },
    address: addresses.weth,
  },
  {
    item: {
      icon: icons.dai,
      item: 'Dai',
    },
    address: addresses.dai,
  },
];

export default class Balances extends scope(LitElement) {
  @property({attribute: false}) balances: ICoinBalancePrice[] = [];

  firstUpdated() {
    this.updateBalances();
  }

  async updateBalances() {
    getAllBalances().then((bals) => {
      this.balances = bals.filter((coin) => !coin.balance.eq(0));
    });
  }

  formatBalance(bal: BigNumber) {
    return ethers.utils.formatEther(bal);
  }

  renderCoin(coin: ICoinBalancePrice) {
    return html`
      <div class="coin">
        <icon-loader metamask class="coinIcon" location=${coin.logo}></icon-loader>
        <span class="coinName">${coin.name}</span>
        <span class="coinBal">${this.formatBalance(coin.balance)}</span>
        <span class="coinPrice ${coin.error ? 'error' : ''}">${coin.price}</span>
      </div>
    `;
  }

  render() {
    return html`
      <div class="wrapper">
        <card-el class="card" header>
          <div slot="header" class="header">
            <span>Token Balances</span>
            <selector-el class="selector" .value=${denoms[0].item} .items=${denoms.map((d) => d.item)} none="Select Base..."></selector-el>
          </div>
          ${this.balances.map((coin) => this.renderCoin(coin))}
        </card-el>
      </div>
    `;
  }

  static styles = css`
    .wrapper {
      height: 100%;
      width: 100%;
    }
    .header {
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: 100%;
    }
    .selector {
      position: absolute;
      right: 20px;
      width: 100px;
      height: 50%;
      top: 0;
      bottom: 0;
      box-sizing: border-box;
    }
    .card::part(wrapper) {
      height: 100%;
      width: 100%;
    }
    .card::part(body) {
      max-width: 100%;
      display: block;
      overflow-y: auto;
    }
    .coin {
      box-sizing: border-box;
      width: 100%;
      display: flex;
      border-bottom: 1px solid var(--accent);
      align-items: center;
    }
    .coin > * {
      padding: 5px;
    }
    .coinIcon::part(wrapper) {
      width: 30px;
      height: 30px;
      padding: 5px;
    }
    .coinName {
      flex-basis: 50%;
    }
    .coinBal {
      flex-basis: 25%;
    }
    .coinPrice {
      flex-basis: 25%;
    }
    .coinPrice.error {
      border: 1px solid red;
      box-sizing: border-box;
    }
  `;

  static get scopedElements() {
    return {
      'card-el': Card,
      'icon-loader': IconLoader,
      'selector-el': Selector,
    };
  }
}
