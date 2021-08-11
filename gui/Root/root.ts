import {LitElement, html, css, TemplateResult} from 'lit-element';
import {ScopedElementsMixin as scope} from '@open-wc/scoped-elements';

import {Router, Route} from '../services/Router';

import Button from '#components/button';
import NotFound from '../Views/notFound';
import NavBar from '../Views/NavBar';
import Home from '../Views/Home';
import {Coins} from '../Views/Coins';
import Box from '../Views/Anim/box';
import Anthill from '#components/anthill';
import Header from '../Views/Header';

export interface View {
  name: string;
  acro: string;
  path: string;
  elementIcon?: {
    element: any; // Lit Element import
    scopeName: string;
    render: TemplateResult;
  }
}

export default class Root extends scope(LitElement) {
  views: View[] = [
    {
      name: 'Home',
      acro: 'H',
      path: '/',
      elementIcon: {
        element: Anthill,
        scopeName: 'anthill-logo',
        render: html`<anthill-logo></anthill-logo>`,
      },
    },
    {
      name: 'Coins',
      acro: 'C',
      path: '/coins',
    },
    {
      name: 'Box',
      acro: 'B',
      path: '/box',
    },
  ]

  render() {
    return html`
      <div class="wrapper">
        <header-el></header-el>
        <div class="body">
          <router-el>
            <route-el route='/'>
              <home-el></home-el>
            </route-el>

            <route-el route='/coins'>
              <coins-el></coins-el>
            </route-el>

            <route-el route='/box'>
              <box-el></box-el>
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
      justify-content: space-between;
    }
    .body {
      height: 80%;
      width: 80%;
    }
    .nav {
      height: 10%;
      margin-bottom: 30px;
    }
  `;

  static get scopedElements() {
    return {
      'header-el': Header,
      'button-el': Button,
      'router-el': Router,
      'route-el': Route,
      'not-found': NotFound,
      'nav-bar': NavBar,
      'home-el': Home,
      'coins-el': Coins,
      'box-el': Box,
    };
  }
}
