import {LitElement, html, css, property} from 'lit-element';
import {unsafeSVG} from 'lit-html/directives/unsafe-svg';
import {until} from 'lit-html/directives/until';

export default class IconLoader extends LitElement {
  @property({type: String}) location!: string;

  @property({attribute: false}) data!: Promise<string>;

  connectedCallback() {
    super.connectedCallback();
    this.data = import(`@metamask/contract-metadata/images/${this.location}`).then((asset) => asset.default );
  }

  async renderIcon(data: Promise<string>) {
    if (this.location.includes('svg')) {
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
