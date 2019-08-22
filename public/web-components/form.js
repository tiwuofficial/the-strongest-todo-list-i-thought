class Form extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'}).innerHTML = `
      <style>
        :host {
          display: block;
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
      </style>

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
          <input type="text" name="title" id="title">
        </mbtl-input>
      </mbtl-fieldset>

      <mbtl-fieldset
        label-for="comment"
        label-text="Comment"
        required
      >
        <mbtl-input>
          <textarea id="comment" name="comment" cols="30" rows="10"></textarea>
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
          <button type="button" id="send">send</button>
        </mbtl-button>
      </mbtl-button-fieldset>
    `;

    const db = firebase.firestore();

    this.shadowRoot.getElementById('send').addEventListener('click', async () => {
      const files = this.shadowRoot.getElementById('file').files;
      let imageUrl = '';
      const image = files[0];
      if (image) {
        await firebase.storage().ref().child(image.name).put(image);
        imageUrl = await firebase.storage().ref().child(image.name).getDownloadURL();
      }

      let list = [];
      this.shadowRoot.querySelectorAll('.tag').forEach(elm => {
        if (elm.value) {
          list.push(elm.value);
          const ref = db.collection('test2').doc(elm.value);
          ref.set({
            count: firebase.firestore.FieldValue.increment(1)
          }, {
            merge: true
          });
        }
      });

      db.collection("test").add({
        url: this.shadowRoot.getElementById('url').value,
        repository_url: this.shadowRoot.getElementById('repository_url').value,
        title: this.shadowRoot.getElementById('title').value,
        comment: this.shadowRoot.getElementById('comment').value,
        list: list,
        imageUrl: imageUrl,
        uid: firebase.auth().currentUser.uid
      });
    });
  }
}
customElements.define('mbtl-form', Form);
