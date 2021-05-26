import {LitElement, html, css, property} from 'lit-element';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';
import {getAllBalances, ICoinBalance} from '#services/coins';
import {BigNumber} from '@ethersproject/bignumber';
import {ethers} from 'ethers';
import {until} from 'lit-html/directives/until';

import {getValueOf} from '#services/uniswap';
import Card from '#components/card';

export default class Balances extends scope(LitElement) {
  @property({attribute: false}) balances: ICoinBalance[] = [];

  firstUpdated() {
    this.updateBalances();
  }

  async updateBalances() {
    getAllBalances();
  }

  formatBalance(bal: BigNumber) {
    return ethers.utils.formatEther(bal);
  }

  renderCoin(coin: ICoinBalance) {
    return html`
      <div class="coin">
        <span class="coinName">${coin.name}</span>
        <span class="coinBal">${this.formatBalance(coin.balance)}</span>
        <span class="coinVal">${until(getValueOf(coin.coin), html`Loading...`)}</span>
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
    .card::part(wrapper){
      height: 100%;
      width: 100%;
    }
  `;

  static get scopedElements() {
    return {
      'card-el': Card,
    };
  }
}
