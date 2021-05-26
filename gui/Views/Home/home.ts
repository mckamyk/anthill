/* eslint-disable max-len */
import {LitElement, html, css, property} from 'lit-element';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';
import {getContract, getMessage, getOwner, setMessage} from '#services/home';
import Anthill from '#components/anthill';
import Input from '#components/input';
import Button from '#components/button';
import Balances from './balances';
import Card from '#components/card';

export default class Home extends scope(LitElement) {
  @property({attribute: false}) owner: string = '';
  @property({attribute: false}) message: string = '';
  @property({attribute: false}) newMessage: string = '';

  @property({attribute: false}) loading = false;

  firstUpdated() {
    getOwner().then((owner) => this.owner = owner);
    getMessage().then((message) => this.message = message);

    const contract = getContract();
    contract.on('MessageUpdated', (message: string) => this.message = message);
  }

  messageChange(ev: CustomEvent<string>) {
    this.newMessage = ev.detail;
  }

  async changeMessage(ev: CustomEvent<void>) {
    const m = this.newMessage;
    this.newMessage = '';
    this.loading = true;
    await setMessage(m);
    this.loading = false;
  }

  render() {
    return html`
      <div class="wrapper">
        <anthill-logo class="logo"></anthill-logo>
        <card-el class="net">
          <!-- remove max len -->
          <span>Lorem quis aute proident aliquip pariatur amet dolore esse incididunt exercitation. Ullamco veniam ad occaecat nisi eu officia ad nulla Lorem id ullamco voluptate duis. Eiusmod excepteur nostrud ea ut cillum pariatur eu. Reprehenderit ullamco velit dolor fugiat sint sint sunt amet ea aliqua voluptate mollit. Aliqua mollit proident duis qui sunt laboris et eiusmod consectetur id adipisicing qui.</span>
        </card-el>
        <div class="balances">
          <ah-balances></ah-balances>
        </div>
      </div>
    `;
  }

  static styles = css`
    .wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-flow: row wrap;
    }
    .wrapper > * {
      flex-grow: 1;
      flex-basis: 50%;
      box-sizing: border-box;
      max-height: 20%;
    }
    .balances {
      height: 60%;
      max-height: unset;
    }
    .logo  {
      height: 100%;
      width: 100%;
    }
  `;

  static get scopedElements() {
    return {
      'ah-input': Input,
      'ah-button': Button,
      'ah-balances': Balances,
      'anthill-logo': Anthill,
      'card-el': Card,
    };
  }
}
