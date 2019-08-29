class IMGFieldset extends HTMLElement {
  constructor() {
    super();

    this.innerHTML = `
      <style>
        mbtl-img-fieldset {
          display: flex;
        }
        .img-fieldset__fieldset {
          border: none;
          margin: 0 auto;
          padding: 0;
        }
        .img-fieldset__title {
          margin: 0;
        }
        .img-fieldset__img {
          width: 300px;
          margin: 0 auto;
          display: block;
        }
       
        .img-fieldset__label {
          display: flex;
          box-sizing: border-box;
          height: 40px;
          width: 600px;
          border: solid 1px #cecece;
          border-radius: 3px;
          padding: 0 5px;
          font-size: 16px;
          color: #333;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          background: #fff;
        }
        
        .img-fieldset__label:hover {
          opacity: 0.9;
        }
        
        .img-fieldset__label.is-disabled {
          color: graytext;
        }
        
        .img-fieldset__title + .img-fieldset__img,
        .img-fieldset__img + .img-fieldset__label {
          margin-top: 20px;
        }

        .img-fieldset__input {
          display: none;
        }  
      </style>
      <fieldset class="img-fieldset__fieldset">
        <p class="img-fieldset__title">ScreenShot</p>
        <img src="/img/no-img.png" alt="no img" class="img-fieldset__img">
        <label for="file" class="img-fieldset__label">
          Upload
          <input type="file" name="file" id="file" class="img-fieldset__input" accept='image/*'>
        </label>
      </fieldset>
    `;

    this.querySelector('.img-fieldset__input').addEventListener('change', (e) => {
      this.querySelector('.img-fieldset__img').src = window.URL.createObjectURL(e.target.files[0]);
    });
  }
}
customElements.define('mbtl-img-fieldset', IMGFieldset);
