import {LitElement, html, css} from 'lit-element';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';

import {Router, Route} from '../services/Router';

import Button from '#components/button';
import NotFound from '../Views/notFound';
import NavBar from '../Views/NavBar';
import Home from '../Views/Home';
import {Coins} from '../Views/Coins';

export interface View {
  name: string,
  acro: string,
  path: string;
}

export default class Root extends scope(LitElement) {
  views: View[] = [
    {
      name: 'Home',
      acro: 'H',
      path: '/',
    },
    {
      name: 'Coins',
      acro: 'C',
      path: '/coins',
    },
  ]

  render() {
    return html`
      <div class="wrapper">
        <div class="body">
          <router-el>
            <route-el route='/'>
              <home-el></home-el>
            </route-el>

            <route-el route='/coins'>
              <coins-el></coins-el>
            </route-el>

            <route-el route='/404'>
              <not-found></not-found>
            </route-el>
          </router-el>
        </div>

        <div class="nav">
          <nav-bar .views=${this.views}></nav-bar>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      width: 100%;
      height: 100%;
    }
    .wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .body {
      flex-grow: 1;
    }
    .nav {
      margin-bottom: 30px;
    }
  `;

  static get scopedElements() {
    return {
      'button-el': Button,
      'router-el': Router,
      'route-el': Route,
      'not-found': NotFound,
      'nav-bar': NavBar,
      'home-el': Home,
      'coins-el': Coins,
    };
  }
}
