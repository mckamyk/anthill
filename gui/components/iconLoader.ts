import {LitElement, html, css, property} from 'lit-element';
import {unsafeSVG} from 'lit-html/directives/unsafe-svg';
import {until} from 'lit-html/directives/until';
// @ts-ignore
import ethSvg from '#assets/eth.svg';
// @ts-ignore
import stableSvg from '#assets/usdc.svg';

export default class IconLoader extends LitElement {
  @property({type: String}) location!: string;
  @property({attribute: false}) isSvg!: boolean;

  @property({attribute: false}) data!: Promise<string>;

  connectedCallback() {
    super.connectedCallback();
    if (this.location === '#eth') {
      this.data = ethSvg;
      this.isSvg = true;
    } else if (this.location === '#stable') {
      this.data = stableSvg;
      this.isSvg = true;
    } else {
      this.data = import(`@metamask/contract-metadata/images/${this.location}`)
          .then((asset) => asset.default);
      this.isSvg = this.location.includes('svg');
    }
  }

  async renderIcon(data: Promise<string>) {
    if (this.isSvg) {
      const svg = await data;
      return html`${unsafeSVG(svg)}`;
    } else {
      const img = await data;
      return html`<img src=${img}></img>`;
    }
  }

  render() {
    return html`
      <div class="wrapper" part="wrapper">
        ${until(this.renderIcon(this.data), 'loading...')}
      </div>
    `;
  }

  static styles = css`
    .wrapper {
      height: 100%;
      width: 100%;
    }
    svg {
      width: inherit;
      height: inherit;
    }
  `;
}
