import {LitElement, html, css, property} from 'lit-element';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';
import {softConnect} from '../ethers';
import {getWinnerRoute} from './util';
import type {RoutePath} from './util';
import {Subject} from 'rxjs';

export let routeTo: (path: string) => void;

export let getUpdater: () => Subject<string> | undefined;

export class Router extends scope(LitElement) {
  @property({type: String}) auth = '/login';
  @property({type: String, attribute: 'not-found'}) notFound = '/404';
  @property({attribute: false}) path = '';

  routes: RoutePath[] = [];
  currentRoutePath?: RoutePath;
  updater?: Subject<string>;

  updated(changes: Map<keyof Router, any>) {
    if (changes.has('path') && this.path) {
      getWinnerRoute(this.routes, this.path ).then((winner) => this.selectWinner(winner));
    }
  }

  setPath(path: string, name?: string) {
    history.pushState({}, name || '', path);
    this.path = path;
  }

  hideRoute(route: RoutePath) {
    route.listener.next(false);
  }

  showRoute(route: RoutePath) {
    route.listener.next(true);
  }

  selectWinner(winner?: RoutePath) {
    if (!winner) return;
    if (!this.currentRoutePath) {
      this.routes.forEach((route) => this.hideRoute(route));
    } else if (this.currentRoutePath !== winner) {
      this.hideRoute(this.currentRoutePath);
    }

    this.showRoute(winner);
    this.updater?.next(winner.path);
    this.currentRoutePath = winner;
  }

  setupUpdate() {
    this.updater = new Subject<string>();
    getUpdater = () => this.updater;
  }

  connectedCallback() {
    softConnect();
    window.onpopstate = (_: PopStateEvent) => {
      this.path = window.location.pathname;
    };
    document.addEventListener('DOMContentLoaded', async () => {
      this.path = window.location.pathname;
      this.selectWinner(await getWinnerRoute(this.routes, this.path));
    });
    routeTo = (path:string) => this.setPath(path);
    this.setupUpdate();
    super.connectedCallback();
  }

  registerRoute(event: CustomEvent<RoutePath>) {
    this.routes.push(event.detail);
  }

  render() {
    return html`
      <div class="wrapper">
        <slot class="slot" @route-path=${this.registerRoute}></slot>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        height: 1000px;
      }
      .wrapper {
        height: 100%;
        width: 100%;
      }
    `;
  }
}
