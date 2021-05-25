import {LitElement, html, css, property} from 'lit-element';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';
import {routeTo, getUpdater} from '#router';
import Button from '#components/button';
import {connect} from '#services/ethers';
import {View} from '../../Root/root';

export default class NavBar extends scope(LitElement) {
  @property({type: Array}) views: View[] = [];
  @property({attribute: false}) currentPath = '';

  updated() {
    const updater = getUpdater();
    if (updater) {
      updater.subscribe({
        next: (path) => this.currentPath = path,
      });
    }
  }

  goTo(path: string) {
    if (this.currentPath !== path) {
      routeTo(path);
    }
  }

  renderView(view: View) {
    return html`
      <div class="view ${this.currentPath === view.path ? 'active' : ''}" @click=${() => this.goTo(view.path)}>
        ${view.acro}
      </div>
    `;
  }

  render() {
    return html`
      <div class="wrapper">
        ${this.views.map((view) => this.renderView(view))}
      </div>
    `;
  }

  connectWallet() {
    connect();
  }

  goHome(ev: MouseEvent) {
    ev.stopPropagation();
    routeTo('/');
  }

  static styles = css`
    .wrapper {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px;
    }
    .wrapper::before {
      content: '';
      width: 100%;
      height: 100%;
      left: 0;
      position: absolute;
      background-color: var(--low);
      border-radius: 10px;
      opacity: 0.5;
      z-index: 1;
    }
    .view {
      display: flex;
      justify-content: center;
      height: 20px;
      width: 20px;
      z-index: 2;
      background: var(--high);
      padding: 10px;
      border-radius: 10px;
      opacity: 0.5;
      user-select: none;
    }
    .view:not(:last-child) {
      margin-right: 10px;
    }
    .view:hover {
      opacity: 1;
    }
    .view.active {
      opacity: 1;
      background-color: var(--accent);
    }
  `;

  static get scopedElements() {
    return {
      'button-el': Button,
    };
  }
}
