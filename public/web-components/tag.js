class Tag extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.attachShadow({mode: 'open'}).innerHTML = `
      <style>
       :host {
          display: block;
          padding: 10px;
        }
        
        a {
          text-decoration: none;
          color: #000;
          text-align: left;
          border: 1px solid #333;
          display: block;
          padding: 5px 15px;
          border-radius: 6px;
        }
    
        .tag {
          font-size: 20px;
          line-height: 26px;
        }
        
        .count {
          font-size: 12px;
          line-height: 16px;
          color: #333;
          background-color: #eee;
          border-radius: 50%;
          padding: 3px 7px;
        }
    
        @media (max-width: 1100px) {
          .item {
            display: none;
          }
    
          .item--logo {
            display: flex;
          }
        }
      </style>
      <a href="${this.getAttribute('href')}">
        <span class="tag">${this.getAttribute('tag')}</span>
        <span class="count">${this.getAttribute('count')}</span>
      </a>
    `;
  }
}
customElements.define('mbtl-tag', Tag);
