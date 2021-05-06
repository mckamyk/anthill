import {css} from 'lit-element';

// https://coolors.co/010c01-012301-093205-386fa4-439413-c0212e
export const colors = css`
  :host {
    --low: #010c01;
    --med: #012301;
    --high: #093205;
    --blue: #386fa4;
    --green: #439413;
    --red: #c0212e;
    --white: #D0D0D0;
    color: var(--white);
  }
`;

export const font = css`
  :host {
    font-family: Arial, Helvetica, sans-serif;
  }
`;