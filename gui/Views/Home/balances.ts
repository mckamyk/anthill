import {LitElement, html, css, property} from 'lit-element';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';
import {getAllStablecoinBalances, ICoinBalance} from '#services/coins';
import {BigNumber} from '@ethersproject/bignumber';
import {ethers} from 'ethers';
import {until} from 'lit-html/directives/until';

import {getValueOf} from '#services/uniswap';

export default class Balances extends scope(LitElement) {
  @property({attribute: false}) balances: ICoinBalance[] = [];

  firstUpdated() {
    this.updateBalances();
  }

  async updateBalances() {
    const bals = await getAllStablecoinBalances();
    this.balances = bals;
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
        Stablecoin Balances
        ${this.balances.map((coin) => this.renderCoin(coin))}
      </div>
    `;
  }

  static styles = css`

  `;

  static get scopedElements() {
    return {

    };
  }
}
