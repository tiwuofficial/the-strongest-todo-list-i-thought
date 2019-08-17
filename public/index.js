const firebaseConfig = {
  apiKey: "AIzaSyCxOJPZH2N7QVToAGA6WKf8Emg75Acta8s",
  authDomain: "the-strongest-todo-list.firebaseapp.com",
  databaseURL: "https://the-strongest-todo-list.firebaseio.com",
  projectId: "the-strongest-todo-list",
  storageBucket: "gs://the-strongest-todo-list.appspot.com/",
  messagingSenderId: "62274701085",
  appId: "1:62274701085:web:a1ed5fd64a2a35e1"
};
firebase.initializeApp(firebaseConfig);

document.getElementById('logout').addEventListener('click', () => {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  })
});

document.getElementById('login').addEventListener('click', () => {
  const provider = new firebase.auth.GithubAuthProvider();
  firebase.auth().signInWithRedirect(provider);
  firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      var token = result.credential.accessToken;
      // ...
    }
    // The signed-in user info.
    var user = result.user;
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
});

