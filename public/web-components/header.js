class Header extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'}).innerHTML = `
      <style>
       :host {
          height: 50px;
          display: flex;
          width: 1000px;
          margin: 0 auto;
          padding: 0 20px;
          box-sizing: border-box;
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
        
        .link--menu {
          text-decoration: underline;
        }
    
        @media (max-width: 600px) {
          :host {
            width: 100%;
          }
          .item {
            display: none;
          }
          .item--logo {
            display: flex;
          }
          .item--menu {
            display: flex;
          }
        }
      </style>
      
      <div class="item item--logo">
        <a href="/" class="link">My Best Todo List</a>
      </div>
      <div class="item">
        <a href="/todoLists" class="link">Todo List List</a>
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
      <div class="item item--menu">
        <a href="javascript:void(0);" class="link link--menu" id="menu">Menu</a>
      </div>
    `;

    this.shadowRoot.getElementById('menu').addEventListener('click', () => {
      document.querySelector('mbtl-side-menu').removeAttribute('hidden');
    });

    this.shadowRoot.getElementById('login').addEventListener('click', () => {
      const provider = new firebase.auth.GithubAuthProvider();
      firebase.auth().signInWithRedirect(provider);
      firebase.auth().getRedirectResult().then(() => {}).catch(() => {});
    });

    this.shadowRoot.getElementById('logout').addEventListener('click', () => {
      firebase.auth().signOut().then(() => {
        location.reload();
      }).catch(() => {});
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.shadowRoot.getElementById('logout').classList.remove('is-hidden');
      } else {
        this.shadowRoot.getElementById('login').classList.remove('is-hidden');
      }
    });
  }
}
customElements.define('mbtl-header', Header);
