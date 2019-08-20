class List extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'}).innerHTML = `
      <style>
       :host {
          display: block;
        }
    
        ul {
          list-style: none;
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          margin: 0;
          padding: 0;
        }
    
        @media (max-width: 1100px) {
        }
      </style>
      
      <ul>
        <slot></slot>
      </ul>
    `;
  }
}
customElements.define('mbtl-list', List);
