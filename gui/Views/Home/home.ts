import {LitElement, html, css, property} from 'lit-element';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';
import ethers from 'ethers';

export default class Home extends scope(LitElement) {
  @property({attribute: false}) txs: any[] = [];

  firstUpdated() {
  }

  render() {
    return html`
      <div>Hello, world.</div>
    `;
  }
}