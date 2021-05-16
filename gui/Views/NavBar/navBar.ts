import {LitElement, html, css} from 'lit-element';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';
import {routeTo} from '#router';
import Button from '#components/button';
import {connect} from '#services/ethers';

export default class NavBar extends scope(LitElement) {
  render() {
    return html`
      <div class="wrapper">
        <div class="name" @click=${this.goHome}>
          <span>Ant Hill</span>
        </div>

        <div class="spacer"></div>

        <div class="connect">
          <button-el @click=${this.connectWallet}>Connect Wallet</button-el>
        </div>
      </div>
    `;
  }

  connectWallet() {
    connect();
  }

  goHome(ev: MouseEvent) {
    ev.stopPropagation();
    routeTo('/');
  }

  static styles = css`
    .wrapper {
      height: 40px;
      width: 100%;
      background: var(--low);
      display: flex;
      align-items: center;
      padding: 0 10px;
    }
    .name {
      font-weight: 600;
      cursor: pointer;
    }
    .spacer {
      flex-grow: 1;
    }
    .connect {
      height: 60%;
      margin-right: 20px;
    }
  `;

  static get scopedElements() {
    return {
      'button-el': Button
    }
  }
}