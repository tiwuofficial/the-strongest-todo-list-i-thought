class Input extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'}).innerHTML = `
      <style>
        :host {
          display: block;
        }
        ::slotted(input),
        ::slotted(textarea) {
          width: 600px;
          border: solid 1px #cecece;
          border-radius: 3px;
          padding: 0 5px;
          font-size: 16px;
          box-sizing: border-box;
        }
        ::slotted(input) {
          height: 40px;
        }
        ::slotted(textarea) {
          min-height: 100px;
          -webkit-appearance: none;
          -moz-appearance: none;
        }
        
        ::slotted(input:disabled),
        ::slotted(textarea:disabled) {
          background-color: #e9eced;
        }
        
        @media (max-width: 600px) {
          ::slotted(input),
          ::slotted(textarea) {
            width: 100%;
          }
        }
      </style>
      <slot></slot>
    `;
  }
}
customElements.define('mbtl-input', Input);
