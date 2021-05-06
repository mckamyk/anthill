import {LitElement, html, customElement, css} from 'lit-element';
import { ScopedElementsMixin as scope } from "@open-wc/scoped-elements";
import {colors, font} from './styles/global';

import Root from "./Root/root";

@customElement('index-element')
export default class IndexElement extends scope(LitElement) {
  render() {
    return html`
      <div class="wrapper">
        <root-el></root-el>
      </div>
    `;
  }

  static styles = [colors, font, css`
    .wrapper {
      background: var(--low);
      width: 100vw;
      height: 100vh;
    }
  `];

  static get scopedElements() {
    return {
      'root-el': Root,
    }
  }
}
