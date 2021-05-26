import {LitElement, html, css, query} from 'lit-element';
// @ts-ignore
import anthillSvg from '#assets/anthill.svg';

export default class Anthill extends LitElement {
  @query('.wrapper') wrapper!: HTMLDivElement;

  @query('#pointTop') pointTop!: SVGCircleElement;
  @query('#pointMidLeft') pointMidLeft!: SVGCircleElement;
  @query('#pointMidMid') pointMidMid!: SVGCircleElement;
  @query('#pointMidRight') pointMidRight!: SVGCircleElement;
  @query('#pointBotLeft') pointBotLeft!: SVGCircleElement;
  @query('#pointBotMid') pointBotMid!: SVGCircleElement;
  @query('#pointBotRight') pointBotRight!: SVGCircleElement;
  @query('#lineLeft') lineLeft!: SVGPathElement;
  @query('#lineRight') lineRight!: SVGPathElement;
  @query('#lineH') lineH!: SVGPathElement;

  firstUpdated() {
    this.wrapper.innerHTML = anthillSvg;
  }

  render() {
    return html`
      <div class="wrapper">
      </div>
    `;
  }

  static styles = css`
    .wrapper {
      width: 100%;
      height: 100%;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `;
}
