import {LitElement, html, css, property} from 'lit-element';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';
import {getAllBalances, ICoinBalancePrice} from '#services/coins';
import {BigNumber} from '@ethersproject/bignumber';
import {ethers} from 'ethers';

import Card from '#components/card';
import IconLoader from '#components/iconLoader';

export default class Balances extends scope(LitElement) {
  @property({attribute: false}) balances: ICoinBalancePrice[] = [];

  firstUpdated() {
    this.updateBalances();
  }

  async updateBalances() {
    this.balances = await getAllBalances();
  }

  formatBalance(bal: BigNumber) {
    return Number(ethers.utils.formatEther(bal)).toLocaleString();
  }

  formatPrice(price: BigNumber) {
    return Number(price.toString()).toLocaleString();
  }

  calculateValue(coin: ICoinBalancePrice) {
    const dec = BigNumber.from('0x1').mul(10).pow(coin.decimals);
    const bal = coin.balance.div(dec);
    return bal.mul(coin.price).toNumber().toLocaleString();
  }

  renderCoin(coin: ICoinBalancePrice) {
    return html`
      <div class="coin">
        <icon-loader class="coinIcon" location=${coin.logo}></icon-loader>
        <span class="coinName">${coin.name}</span>
        <span class="coinBal">${this.formatBalance(coin.balance)}</span>
        <span class="coinPrice">${this.formatPrice(coin.price)}</span>
        <span class="coinValue">${this.calculateValue(coin)}</span>
      </div>
    `;
  }

  render() {
    return html`
      <div class="wrapper">
        <card-el class="card">
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
      flex-grow: 1;
    }
  `;

  static get scopedElements() {
    return {
      'card-el': Card,
      'icon-loader': IconLoader,
    };
  }
}
