import { LitElement, html, css} from "lit-element";
import { ScopedElementsMixin as scope } from "@open-wc/scoped-elements";

import {Router, Route, routeTo} from '../services/Router';

import Button from "#components/button";
import NotFound from "../Views/notFound";
import NavBar from "../Views/NavBar";
import Home from "../Views/Home";

export default class Root extends scope(LitElement) {
  render() {
    return html`
      <div class="wrapper">
        <nav-bar></nav-bar>

        <router-el>
          <route-el route='/'>
            <home-el></home-el>
          </route-el>

          <route-el route='/404'>
            <not-found></not-found>
          </route-el>
        </router-el>
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
    }
  }
}