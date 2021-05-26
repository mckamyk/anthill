import {css} from 'lit-element';

// https://coolors.co/141414-292929-3d3d3d-525252-e8985e-56e39f-f5dd90-4ea5d9-eb5e55-defaff
export const colors = css`
  :host {
    --bg: #141414;
    --low: #333333;
    --medium: #525252;
    --high: #707070;
    --warn: #e8985e;
    --success: #56E39F;
    --caution: #F5DD90;
    --accent: #4EA5D9;
    --error: #EB5E55;
    --white: #defaff;
    color: var(--white);
  }
`;

export const font = css`
  :host {
    font-family: Arial, Helvetica, sans-serif;
  }
`;
