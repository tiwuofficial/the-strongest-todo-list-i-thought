class ButtonFieldset extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'}).innerHTML = `
      <style>
        :host {
          display: flex;
        }
        fieldset {
          border: none;
          margin: 0 auto;
          padding: 0;
        }
      </style>
      <fieldset>
        <slot></slot>
      </fieldset>
    `;
  }
}
customElements.define('mbtl-button-fieldset', ButtonFieldset);
