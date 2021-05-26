import {LitElement, html, css} from 'lit-element';

export default class Box extends LitElement {
  render() {
    return html`
      <div class="wrapper">
        <svg class="view" viewbox="0 0 300 300">
          <circle class="cir" r="75" cx="150" cy="150"/>
        </svg>
      </div>
    `;
  }

  static styles = css`
    .wrapper {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cir {
      fill: var(--accent);
    }
    .view {
      width: 300px;
      height: 300px;
      border: 1px solid red;
    }
  `;
}
