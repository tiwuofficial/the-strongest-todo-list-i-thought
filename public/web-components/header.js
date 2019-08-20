class Header extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});

    shadowRoot.innerHTML = `
      <style>
       :host {
          height: 50px;
          display: flex;
          width: 1000px;
          margin: 0 auto;
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
    
        .item.is-hidden {
          display: none;
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
      <div class="item is-hidden" id="login">
        <a href="javascript:void(0);" class="link">GitHub Login</a>
      </div>
      <div class="item is-hidden" id="logout">
        <a href="javascript:void(0);" class="link">Logout</a>
      </div>
    `;

    shadowRoot.getElementById('login').addEventListener('click', () => {
      const provider = new firebase.auth.GithubAuthProvider();
      firebase.auth().signInWithRedirect(provider);
      firebase.auth().getRedirectResult().then(() => {}).catch(() => {});
    });

    shadowRoot.getElementById('logout').addEventListener('click', () => {
      firebase.auth().signOut().then(() => {
        location.reload();
      }).catch(() => {});
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        shadowRoot.getElementById('logout').classList.remove('is-hidden');
      } else {
        shadowRoot.getElementById('login').classList.remove('is-hidden');
      }
    });
  }
}
customElements.define('mbtl-header', Header);
