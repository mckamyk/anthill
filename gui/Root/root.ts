import { LitElement, html, css, property } from "lit-element";
import { ScopedElementsMixin as scope } from "@open-wc/scoped-elements";

import Button from "@components/button";

export default class Root extends scope(LitElement) {
  render() {
    return html`
      <div class="wrapper">
        <button-el class="button"><span>Enter the Night</span></button-el>
      </div>
    `;
  }

  static styles = css`
    :host {
      width: 100%;
      height: 100%;
    }
    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
    .button {
      width: 150px;
      height: 50px;
    }
  `;

  static get scopedElements() {
    return {
      'button-el': Button
    }
  }
}