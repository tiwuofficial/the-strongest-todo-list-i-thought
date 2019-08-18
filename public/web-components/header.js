class Header extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});

    shadowRoot.innerHTML = `
      <style>
       :host {
          height: 50px;
          display: flex;
          padding: 0 50px;
        }
    
        .item {
          display: flex;
          align-items: center;
        }
    
        .item:first-of-type {
          flex-grow: 1;
        }
    
        .item + .item {
          margin-left: 40px;
        }
    
        .link {
          color: #000;
          text-decoration: none;
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
      
      <div class="item item--logo">
        <a href="/" class="link">My Best Todo List</a>
      </div>
      <div class="item">
        <a href="/tags" class="link">Tag List</a>
      </div>
      <div class="item">
        <a href="/create" class="link">Post</a>
      </div>
      <div class="item" id="login">
        <a href="javascript:void(0);" class="link">GitHub Login</a>
      </div>
      <div class="item" id="logout">
        <a href="javascript:void(0);" class="link">Logout</a>
      </div>
    `;

    shadowRoot.getElementById('login').addEventListener('click', () => {
      const provider = new firebase.auth.GithubAuthProvider();
      firebase.auth().signInWithRedirect(provider);
      firebase.auth().getRedirectResult().then(() => {}).catch(() => {});
    });

    shadowRoot.getElementById('login').addEventListener('click', () => {
      firebase.auth().signOut().then(() => {}).catch(() => {});
    });
  }
}
customElements.define('mbtl-header', Header);
