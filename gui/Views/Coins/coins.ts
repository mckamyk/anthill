import {LitElement, html, css} from 'lit-element';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';

export default class Coins extends scope(LitElement) {
  render() {
    return html`
      <div>Hi from coins</div>
    `;
  }

  static styles = css``;
}
