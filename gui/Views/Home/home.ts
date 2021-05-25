import {LitElement, html, css, property} from 'lit-element';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';
import {getContract, getMessage, getOwner, setMessage} from '#services/home';
import Input from '#components/input';
import Button from '#components/button';
import Balances from './balances';

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
        <ah-balances></ah-balances>
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
      flex-flow: column nowrap;
    }
    .updateMessage {
      display: flex;
      align-items: center;
      height: 40px;
    }
    .updateMessage > span {
      margin-right: 10px;
    }
    .button::part(wrapper) {
      height: 40px;
    }
  `;

  static get scopedElements() {
    return {
      'ah-input': Input,
      'ah-button': Button,
      'ah-balances': Balances,
    };
  }
}
