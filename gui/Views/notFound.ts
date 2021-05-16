import {LitElement, html, css} from 'lit-element';

export default class NotFound extends LitElement {
  render() {
    return html`
      <div class="wrapper">
        Not Found :(
      </div>
    `
  }

  static styles = css`
    .wrapper {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `;
}