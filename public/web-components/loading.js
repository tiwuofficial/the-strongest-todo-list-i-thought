class Loading extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'}).innerHTML = `
      <style>
        div {
          width: 10px;
          height: 10px;
          background-color: #000;
          border-radius: 100%;
          margin: 1px;
          display: inline-block;
        }
        .first {
          -webkit-animation: scale .75s -.24s infinite cubic-bezier(.2,.68,.18,1.08);
          animation: scale .75s -.24s infinite cubic-bezier(.2,.68,.18,1.08);
        }
        .second {
          -webkit-animation: scale .75s -.12s infinite cubic-bezier(.2,.68,.18,1.08);
          animation: scale .75s -.12s infinite cubic-bezier(.2,.68,.18,1.08);
        }
        .third {
          -webkit-animation: scale .75s 0s infinite cubic-bezier(.2,.68,.18,1.08);
          animation: scale .75s 0s infinite cubic-bezier(.2,.68,.18,1.08);
        }
        @-webkit-keyframes scale {
            0%,80% {
                -webkit-transform: scale(1);
                transform: scale(1);
                opacity: 1
            }
        
            45% {
                -webkit-transform: scale(.1);
                transform: scale(.1);
                opacity: .7
            }
        }
        
        @keyframes scale {
            0%,80% {
                -webkit-transform: scale(1);
                transform: scale(1);
                opacity: 1
            }
        
            45% {
                -webkit-transform: scale(.1);
                transform: scale(.1);
                opacity: .7
            }
        }
      </style>
      <div class="first"></div>
      <div class="second"></div>
      <div class="third"></div>
    `;
  }
}
customElements.define('mbtl-loading', Loading);
