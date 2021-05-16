import {LitElement, html, css, property} from 'lit-element';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';

import {RoutePath, getAttrs, pathToParts, drainNode} from './util';
import {Subject} from 'rxjs';

export class Route extends scope(LitElement) {
  @property({type: String}) readonly route: string = '/';
  @property({type: Boolean}) readonly persist = false;
  @property({type: Boolean}) readonly protected = false;
  @property({attribute: false}) show = true;

  readonly channel: Subject<boolean> = new Subject<boolean>();
  readonly childRoutes: RoutePath[] = [];

  clonedChildren: Node[] = []

  get attrs() {
    return getAttrs(this.route);
  }

  get isAttached(): boolean {
    return this.childNodes.length > 0;
  }

  firstUpdated() {
    this.broadcastRoute();
    this.detach();
  }

  connectedCallback() {
    this.channel.subscribe((show) => {
      this.show = show;
      this.childRoutes.forEach((cr) => cr.listener.next(show));

      if (this.show) {
        this.attach();
      } else {
        this.detach();
      }
    });
    this.childNodes.forEach((node) => this.clonedChildren.push(node.cloneNode()));
    super.connectedCallback();
  }

  shouldUpdate() {
    return this.show;
  }

  async detach() {
    if (this.persist) {
      this.hidden = true;
    } else {
      drainNode(this);
    }
  }

  attach() {
    if (this.persist) {
      this.hidden = false;
    } else if (!this.isAttached) {
      this.clonedChildren.forEach((child) => {
        this.appendChild(child.cloneNode());
      });
    }
    this.applyAttrs();
  }

  applyAttrs() {
    const parts = pathToParts(document.location.pathname);
    this.attrs.forEach((attr, index) => {
      if (attr) {
        for (let i = 0; i < this.children.length; i++) {
          this.children[i].setAttribute(attr, parts[index]);
        }
      }
    });
  }

  broadcastRoute(route?: RoutePath) {
    this.dispatchEvent(new CustomEvent<RoutePath>('route-path', {
      composed: true,
      bubbles: true,
      detail: route || {
        path: this.route,
        listener: this.channel,
        protected: this.protected,
        children: [],
      },
    }));
  }

  catchRoute(event: CustomEvent<RoutePath>) {
    this.childRoutes.push(event.detail);

    const route = event.detail;
    this.broadcastRoute({
      ...route,
      protected: this.protected,
    });
  }

  copyAttr(attr: string) {
    const val = this.getAttribute(attr);
    if (!val) return;

    const chil = this.children;
    for (let i = 0; i < chil.length; i++) {
      const child = chil[i];
      child.setAttribute(attr, val);
    }
  }

  render() {
    return html`<slot class="slot" @route-path=${this.catchRoute}></slot>`;
  }

  static get styles() {
    return css`
      :host {
        min-height: 100%;
        width: 100%;
      }
    `;
  }
}
