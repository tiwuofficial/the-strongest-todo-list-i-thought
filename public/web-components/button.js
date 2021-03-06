class Button extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'}).innerHTML = `
      <style>
        :host {
          display: block;
        }
        ::slotted(button) {
          width: 600px;
          height: 40px;
          border: solid 1px #cecece;
          border-radius: 3px;
          padding: 0 5px;
          font-size: 16px;
          box-sizing: border-box;
          cursor: pointer;
        }
        ::slotted(button:disabled) {
          background-color: #e9eced;
        }
        @media (max-width: 600px) {
          ::slotted(button) {
            width: 100%;
          }
        }
      </style>
      <slot></slot>
    `;
  }
}
customElements.define('mbtl-button', Button);
