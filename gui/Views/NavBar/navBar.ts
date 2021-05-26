import {LitElement, html, css, property} from 'lit-element';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';
import {routeTo, getUpdater} from '#router';
import Button from '#components/button';
import {connect} from '#services/ethers';
import {View} from '../../Root/root';

export default class NavBar extends scope(LitElement) {
  @property({type: Array}) views: View[] = [];
  @property({attribute: false}) currentPath = '';

  updated(changes: Map<keyof NavBar, any>) {
    const updater = getUpdater();
    if (updater) {
      updater.subscribe({
        next: (path) => this.currentPath = path,
      });
    }
    if (changes.has('views')) {
      this.registerIconComponents();
    }
  }

  registerIconComponents() {
    const withIcons = this.views.filter((view) => view.elementIcon);
    withIcons.forEach((view) => {
      if (!view.elementIcon) return;

      const {scopeName, element} = view.elementIcon;
      if (!Object.keys(NavBar.scopedElements).includes(scopeName)) {
        this.defineScopedElement(scopeName, element);
      }
    });
  }

  goTo(path: string) {
    if (this.currentPath !== path) {
      routeTo(path);
    }
  }

  renderView(view: View) {
    return html`
      <div class="view ${this.currentPath === view.path ? 'active' : ''}" @click=${() => this.goTo(view.path)}>
        ${view.elementIcon ?
            view.elementIcon.render :
            view.acro
}
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
      height: 80px;
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
      background-color: var(--medium);
      border-radius: 10px;
      opacity: 0.5;
      z-index: 1;
    }
    .view {
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      height: 50px;
      width: 50px;
      z-index: 2;
      background: var(--high);
      border-radius: 10px;
      opacity: 0.5;
      padding: 5px;
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid transparent;
    }
    .view:not(:last-child) {
      margin-right: 10px;
    }
    .view:hover {
      opacity: 1;
    }
    .view.active {
      opacity: 1;
      border: 2px solid var(--accent);
    }
  `;

  static get scopedElements() {
    return {
      'button-el': Button,
    };
  }
}
