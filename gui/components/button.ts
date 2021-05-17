import {LitElement, html, css} from 'lit-element';
import {colors} from '../styles/global';

export default class Button extends LitElement {
  render() {
    return html`
      <div class="wrapper" @click=${this.clicked} part="wrapper">
        <slot></slot>
      </div>
    `;
  }

  clicked(ev: MouseEvent) {
    ev.stopPropagation();
    this.dispatchEvent(new CustomEvent<void>('click', {
      bubbles: true,
      composed: true,
    }));
  }

  static styles = [colors, css`
    .wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--high);
      padding: 10px;
      box-sizing: border-box;
      box-shadow: 0 0 0 transparent;
      transition: background 0.1s linear, box-shadow 0.1s linear;
      cursor: pointer;
      user-select: none;
    }
    .wrapper:hover {
      background: var(--accent);
      box-shadow: 0 0 10px var(--accent);
    }
    .wrapper:active {
      background: var(--accent);
    }
  `]
}
