class Form extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'}).innerHTML = `
      <style>
        :host {
          display: block;
        }
        
        mbtl-input:not(:defined),
        mbtl-button:not(:defined) {
          display: none;
        }

        mbtl-fieldset + mbtl-fieldset,
        mbtl-fieldset + mbtl-img-fieldset {
          margin-top: 30px;
        }
  
        mbtl-img-fieldset + mbtl-button-fieldset {
          margin-top: 50px;
        }
  
        mbtl-input + mbtl-input {
          margin-top: 30px;
        }
        
        .login-text {
          text-align: center;
          margin: 0;
          font-size: 24px;
          color: #fffb00;
        }
        
        .login-link {
          color: #fffb00;
        }
        
        .is-hidden {
          display: none;
        }
        
        .login-text:not(.is-hidden) + mbtl-fieldset {
          margin-top: 20px;
        } 
      </style>
      
      <p id="login" class="login-text is-hidden">
        Required <a href="javascript:void(0);" class="login-link" id="login-link">GitHub Login!</a>
      </p>
      

      <mbtl-fieldset
        label-for="url"
        label-text="URL"
        required
      >
        <mbtl-input>
          <input type="text" name="url" id="url" required>
        </mbtl-input>
      </mbtl-fieldset>

      <mbtl-fieldset
        label-for="repository_url"
        label-text="Repository URL"
      >
        <mbtl-input>
          <input type="text" name="repository_url" id="repository_url">
        </mbtl-input>
      </mbtl-fieldset>

      <mbtl-fieldset
        label-for="title"
        label-text="Title"
        required
      >
        <mbtl-input>
          <input type="text" name="title" id="title" required>
        </mbtl-input>
      </mbtl-fieldset>

      <mbtl-fieldset
        label-for="comment"
        label-text="Comment"
        required
      >
        <mbtl-input>
          <textarea id="comment" name="comment" cols="30" rows="10" required></textarea>
        </mbtl-input>
      </mbtl-fieldset>

      <mbtl-fieldset
        label-for="tag"
        label-text="Tag"
        one-required
      >
        <div>
          <mbtl-input>
            <input type="text" class="tag">
          </mbtl-input>
          <mbtl-input>
            <input type="text" class="tag">
          </mbtl-input>
          <mbtl-input>
            <input type="text" class="tag">
          </mbtl-input>
          <mbtl-input>
            <input type="text" class="tag">
          </mbtl-input>
          <mbtl-input>
            <input type="text" class="tag">
          </mbtl-input>
        </div>
      </mbtl-fieldset>

      <mbtl-img-fieldset></mbtl-img-fieldset>

      <mbtl-button-fieldset>
        <mbtl-button>
          <button type="button" id="send" disabled>
            <span id="send-text">send</span>
            <mbtl-loading id="send-loading" class="is-hidden"></mbtl-loading>
          </button> 
        </mbtl-button>
      </mbtl-button-fieldset>
    `;

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.shadowRoot.querySelectorAll(':required').forEach(elm => {
          elm.addEventListener('input', validation);
        });
        this.shadowRoot.querySelectorAll('.tag').forEach(elm => {
          elm.addEventListener('input', validation);
        });
      }else {
        this.shadowRoot.getElementById('login').classList.remove('is-hidden');
        this.shadowRoot.querySelectorAll('input').forEach(elm => {
          elm.setAttribute('disabled', true);
        });
        this.shadowRoot.querySelector('textarea').setAttribute('disabled', true);
        this.shadowRoot.querySelector('mbtl-img-fieldset').classList.add('is-disabled');
      }
    });

    const db = firebase.firestore();

    this.shadowRoot.getElementById('login-link').addEventListener('click', () => {
      const provider = new firebase.auth.GithubAuthProvider();
      firebase.auth().signInWithRedirect(provider);
      firebase.auth().getRedirectResult().then(() => {}).catch(() => {});
    });

    this.shadowRoot.getElementById('send').addEventListener('click', async () => {
      if (this.shadowRoot.getElementById('send-text').classList.contains('is-hidden')) {
        return false;
      }

      this.shadowRoot.getElementById('send-text').classList.add('is-hidden');
      this.shadowRoot.getElementById('send-loading').classList.remove('is-hidden');

      const files = this.shadowRoot.getElementById('file').files;
      let imageUrl = '';
      let thumbnailImageUrl = '';
      const image = files[0];
      if (image) {
        const path = `mbtl_images/${image.name}`;
        await firebase.storage().ref().child(path).put(image);
        imageUrl = await firebase.storage().ref().child(path).getDownloadURL();
        const splitImageUrl = imageUrl.split('mbtl_images%2F');
        thumbnailImageUrl = `${splitImageUrl[0]}mbtl_images%2Fthumb_${splitImageUrl[1]}`;
      }

      let list = [];
      this.shadowRoot.querySelectorAll('.tag').forEach(elm => {
        if (elm.value) {
          list.push(elm.value);
          const ref = db.collection('tags').doc(elm.value);
          ref.set({
            count: firebase.firestore.FieldValue.increment(1)
          }, {
            merge: true
          });
        }
      });

      db.collection("todolists").add({
        url: this.shadowRoot.getElementById('url').value,
        repository_url: this.shadowRoot.getElementById('repository_url').value,
        title: this.shadowRoot.getElementById('title').value,
        comment: this.shadowRoot.getElementById('comment').value,
        list: list,
        imageUrl: imageUrl,
        thumbnailImageUrl: thumbnailImageUrl,
        uid: firebase.auth().currentUser.uid
      }).then(doc => {
        location.href = `/todoLists/${doc.id}`;
      }).catch(() => {
        this.shadowRoot.getElementById('send-text').classList.remove('is-hidden');
        this.shadowRoot.getElementById('send-loading').classList.add('is-hidden');
      });
    });

    const validation = () => {
      const input = Array.prototype.slice.call(this.shadowRoot.querySelectorAll(':required')).every(e => {
        return e.value.trim() !== '';
      });

      const tag = Array.prototype.slice.call(this.shadowRoot.querySelectorAll('.tag')).some(e => {
        return e.value.trim() !== '';
      });

      if (input && tag) {
        this.shadowRoot.querySelector('button').removeAttribute('disabled');
      } else {
        this.shadowRoot.querySelector('button').setAttribute('disabled', true);
      }
    }
  }
}
customElements.define('mbtl-form', Form);
