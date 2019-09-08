class Fieldset extends HTMLElement {
  constructor() {
    super();

    let required = '';
    if (this.hasAttribute('required')) {
      required = `<span class="required">required</span>`;
    }

    let oneRequired = '';
    if (this.hasAttribute('one-required')) {
      oneRequired = `<span class="required">One is required</span>`;
    }

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
        slot {
          display: block;
        }
        label + slot {
          margin-top: 30px;
        }
        .required {
          font-size: 13px;
          color: #FFC10D;
        }
        @media (max-width: 600px) {
          fieldset {
            width: 100%;
          }
        }
      </style>
      <fieldset>
        <label for="${this.getAttribute('label-for')}">
          ${this.getAttribute('label-text')}
          ${required}
          ${oneRequired}
        </label>
        <slot></slot>
      </fieldset>
    `;
  }
}
customElements.define('mbtl-fieldset', Fieldset);
