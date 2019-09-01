class Detail extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    let src = '';
    if (this.getAttribute('img-url')) {
      src = this.getAttribute('img-url');
    } else {
      src = '/img/no-img.png'
    }

    let tags = '';
    JSON.parse(this.getAttribute('tags')).forEach(tag => {
      tags += `
        <span class="tag"><a href="/tags/${tag}">${tag}</a></span>
      `;
    });

    const shadowRoot = this.attachShadow({mode: 'open'});

    shadowRoot.innerHTML = `
      <style>
       :host {
          display: flex;
          width: 1000px;
          margin: 0 auto;
        }
    
        .info {
          width: 60%;
        }
        
        img {
          width: 40%;
          height: 100%;
        }
        
        a {
          color: #fff;
        }
    
        @media (max-width: 600px) {
          :host {
            flex-direction: column-reverse;
            width: 100%;
          }
    
          .info {
            width: 100%;
          }
          
          img {
            width: 100%;
          }
        }
      </style>
      
      <div class="info">
        <h1>Title : ${this.getAttribute('title')}</h1>
        <p>Author : ${this.getAttribute('user-name')}</p>
        <p>Url : <a href="${this.getAttribute('url')}">${this.getAttribute('url')}</a></p>
        <p>Repository Url : <a href="${this.getAttribute('repository-url')}">${this.getAttribute('repository-url')}</a></p>
        <h3>Comment</h3>
        <p>${this.getAttribute('comment')}</p>
        <h3>Tags</h3>
        <div>${tags}</div>
      </div>
      <img src="${src}" alt="screen shot">
    `;

  }
}
customElements.define('mbtl-todo-list-detail', Detail);
