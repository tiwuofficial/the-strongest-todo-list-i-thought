class Card extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    let src = '';
    if (this.getAttribute('src')) {
      src = this.getAttribute('src');
    } else {
      src = '/img/no-img.png'
    }

    let tags = '';
    JSON.parse(this.getAttribute('tags')).forEach(tag => {
      tags += `
        <span class="tag">${tag}</span>
      `;
    });

    this.attachShadow({mode: 'open'}).innerHTML = `
      <style>
       :host {
          width: 300px;
          display: block;
          padding: 10px;
          line-height: 0;
        }
        
        a {
          text-decoration: none;
          color: #000;
          background-color: #fff;
          text-align: left;
          display: block;
          border-radius: 6px;
          box-shadow: 0 0 10px 4px rgba(0, 0, 0, 0.2);
        }
        
        .img-wrap {
          width: 100%;
          height: 200px;
        }
        
        img {
          object-fit: contain;
          width: 100%;
          height: 100%;
        }
        
        .text-wrap {
          padding: 10px;
          border-top: 1px solid #aaa;
        }
        
        p {
          margin: 0;
        }
    
        .title {
          font-size: 16px;
          line-height: 26px;
        }
        
        .tag {
          font-size: 12px;
          line-height: 16px;
          color: #333;
          background-color: #eee;
          padding: 3px 6px;
        }
        
        .title + .tag-wrap {
          margin-top: 10px;
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
        <div class="img-wrap">
          <img src="${src}" alt="screen shot">
        </div>
        <div class="text-wrap">
          <p class="title">${this.getAttribute('title')}</p>
          <div class="tag-wrap">
            ${tags}
          </div>
        </div>
      </a>
    `;
  }
}
customElements.define('mbtl-todo-list-card', Card);
