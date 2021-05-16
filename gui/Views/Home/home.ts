import {LitElement, html, css, property} from 'lit-element';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';
import ethers from 'ethers';
import { getOwner } from '#services/home';

export default class Home extends scope(LitElement) {
  @property({attribute: false}) owner: string = '';

  firstUpdated() {
    getOwner().then((owner) => this.owner = owner);
  }

  render() {
    return html`
      <div>Owner: ${this.owner}</div>
    `;
  }
}