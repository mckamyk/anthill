import {LitElement, html, css, property} from 'lit-element';
import {colors} from '../styles/global';

export default class Input extends LitElement {
  @property({type: String}) label?: string;
  @property({type: String}) value = '';

  updateValue(ev: InputEvent) {
    const tgt = ev.target as HTMLInputElement;
    this.value = tgt.value;
    this.dispatchEvent(new CustomEvent<string>('change', {
      bubbles: true,
      composed: true,
      detail: this.value,
    }));
  }

  render() {
    return html`
      <div class="wrapper">
        <div class="field" part="field">
          <input type="text" @input=${this.updateValue}></input>
        </div>
      </div>
    `;
  }

  static styles = [colors, css`
    .wrapper {
      width: 100%;
      height: 100%;
    }
    .field {
      background: var(--high);
      height: 40px;
      display: flex;
      align-items: center;
      font-size: 16px;
      box-sizing: border-box;
    }
    input {
      margin: 10px 0;
      flex-grow: 1;
      height: 80%;
      background: unset;
      border: 0;
      font-size: inherit;
    }
    input:focus {
      outline: none;
    }
  `];
}
