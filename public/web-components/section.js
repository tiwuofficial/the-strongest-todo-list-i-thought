class Section extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'}).innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          padding: 50px;
          color: #fff;
        }
        :host(.white) {
          color: #333d46;
        }

        :host::before {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          content: "";
          z-index: -1;
          transform: skewY(-2.5deg);
          background-image: linear-gradient(36deg,#15eac8,#2ba4f3 52%,#0906e8);
        }
        
        :host(.white)::before {
          background-image: none;
          background-color: #fff;
        }
        
        ::slotted(h1),
        ::slotted(h2) {
          text-align: center;
          margin: 0;
        }
        
        ::slotted(p) {
          text-align: center;
          margin: 0;
          font-size: 17px;
          line-height: 30px;
        }
        
        ::slotted(img) {
          width: 100px;
          margin: 0 auto;
          display: block;
        }
        
        section {
          margin: 0 auto;
          width: 1000px;
        }
        
        @media (max-width: 600px) {
          :host {
            padding: 50px 20px;
          }
          section {
            width: 100%;
          }
        }
      </style>
      <section>
        <slot></slot>
      </section>
    `;
  }
}
customElements.define('mbtl-section', Section);
