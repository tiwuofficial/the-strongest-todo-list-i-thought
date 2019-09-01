class SideMenu extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'}).innerHTML = `
      <style>
       :host {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          position: absolute;
          display: block;
          z-index: 120;
        }
        
        :host([hidden]) {
          display: none;
        }
    
        .overlay {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: block;
          position: fixed;
          background: #000;
          opacity: 0.6;
          z-index: 130;
        }
        
        .list {
          top: 0;
          right: 0;
          height: 100%;
          text-align: center;
          display: block;
          position: fixed;
          z-index: 140;
          background-color: #fff;
          overflow-y: scroll;
          margin: 0;
          padding: 0;
          list-style-type: none;
        }
        
        .item {
          border-bottom: 1px solid #d4d4d6;
        }
        
        .item.is-hidden {
          display: none;
        }
        
        .link {
          padding: 20px 30px;
          display: block;
          color: #000;
          text-decoration: none;
        }
      </style>
      
      <a href="javascript:void(0);" class="overlay"></a>
      <div class="list">
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
      </div>
    `;

    this.shadowRoot.querySelector('.overlay').addEventListener('click', () => {
      this.setAttribute('hidden', true);
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
customElements.define('mbtl-side-menu', SideMenu);
