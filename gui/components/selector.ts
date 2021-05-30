import {LitElement, html, css, property} from 'lit-element';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';
import IconLoader from './iconLoader';

export interface ItemIcon {
  item: string;
  icon: string;
  iconIsMetamask?: boolean;
}

export default class Selector extends scope(LitElement) {
  @property({type: Array}) items!: ItemIcon[] | string[];
  @property({type: Object}) value?: ItemIcon | string;
  @property({type: String}) none = 'Select One...'

  @property({attribute: false}) show = false;

  toggle(ev: MouseEvent) {
    ev.stopPropagation();
    this.show = !this.show;
  }

  select(item: string |ItemIcon) {
    this.value = item;
  }

  renderOpt(opt: string | ItemIcon) {
    if (typeof opt === typeof '') {
      return html`
        <div class="option ${this.show ? 'show' : ''}" @click=${() => this.select(opt)}>
          ${opt}
        </div>
      `;
    } else {
      const o = opt as ItemIcon;
      return html`
        <div class="option ${this.show ? 'show' : ''}" @click=${() => this.select(opt)}>
          <icon-el class="icon" location=${o.icon}></icon-el>
          <span class="item">${o.item}</span>
        </div>
      `;
    }
  }

  renderOptions() {
    return html`
      <div class="options">
        ${this.items.map((item: ItemIcon | string) => this.renderOpt(item))}
      </div>
    `;
  }

  render() {
    return html`
      <div class="wrapper ${this.show ? 'show' : ''}" @click=${this.toggle}>
        ${this.value ? this.renderOpt(this.value) : this.none}
        ${this.show ? this.renderOptions() : ``}
      </div>
    `;
  }

  static styles = css`
    .wrapper {
      width: 100%;
      height: 100%;
      background: var(--medium);
      padding: 10px;
      border-radius: 10px;
      position: relative;
      user-select: none;
      display: flex;
      align-items: center;
    }
    .options {
      position: absolute;
      background-color: var(--medium);
      padding: 10px;
      width: 100%;
      box-sizing: border-box;
      top: 0;
      left: 0;
      border-radius: 10px;
    }
    .option {
      display: flex;
      height: 20px;
      width: 100%;
      padding: 5px 0;
      align-items: center;
    }
    .option.show:hover {
      cursor: pointer;
      background: var(--accent);
    }
    .icon {
      height: 20px;
      width: 20px;
      margin-right: 5px;
    }
    .item {
      flex-grow: 1;
    }
  `;

  static get scopedElements() {
    return {
      'icon-el': IconLoader,
    };
  }
}
