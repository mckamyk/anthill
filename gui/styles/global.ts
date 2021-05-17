import {css} from 'lit-element';

// https://coolors.co/010c01-012301-093205-386fa4-439413-c0212e
export const colors = css`
  :host {
    --bg: #150a04;
    --low: #4f4233;
    --high: #DFA16A;
    --white: #EEDFCB;
    --accent: #8A9256;
    --disable: #5e5954;
    color: var(--white);
  }
`;

export const font = css`
  :host {
    font-family: Arial, Helvetica, sans-serif;
  }
`;
