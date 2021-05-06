import { LitElement, html, css, property} from "lit-element";
import { colors } from "../styles/global";

export default class Button extends LitElement {
  render() {
    return html`
      <div class="wrapper">
        <slot></slot>
      </div>
    `;
  }

  static styles = [colors, css`
    :host {
      --color: var(--color, var(--green));
    }
    .wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--high);
      padding: 10px;
      box-sizing: border-box;
      border-radius: 10px;
      box-shadow: 0 0 10px var(--green);
      transition: background 0.1s linear, box-shadow 0.75s linear;
      cursor: pointer;
      user-select: none;
    }
    .wrapper:hover {
      background: var(--green);
      box-shadow: 0 0 20px var(--green);
    }
    .wrapper:active {
      background: var(--blue);
    }
  `]
}