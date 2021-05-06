import { LitElement, html, css, property } from "lit-element";
import {colors} from '../styles/global';

export default class Card extends LitElement {
  @property({type: Boolean}) header = false;
  @property({type: Boolean}) footer = false;

  render() {
    return html`
      <div class="wrapper">
        ${this.header ? html`
          <div part="header" class="header">
            <slot name="header"></slot>
          </div>
        ` : ''}

        <div part="body" class="body">
          <slot></slot>
        </div>

        ${this.footer ? html`
          <div part="footer" class="footer">
            <slot name="footer"></slot>
          </div>
        ` : ''}
      </div>
    `;
  }

  static styles = [colors, css`
    :host {
      --bg-color: var(--color, var(--med));
      --line: var(--line-color, var(--high));
    }
    .wrapper {
      width: 100%;
      height: 100%;
      background: var(--bg-color);
      border-radius: 10px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 0 10px var(--green);
    }
    .header {
      border-bottom: 1px solid var(--line);
      padding-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .footer {
      border-top: 1px solid var(--line);
      padding-top: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .body {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `];
}