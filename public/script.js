const firebaseConfig = {
  apiKey: "AIzaSyCxOJPZH2N7QVToAGA6WKf8Emg75Acta8s",
  authDomain: "the-strongest-todo-list.firebaseapp.com",
  databaseURL: "https://the-strongest-todo-list.firebaseio.com",
  projectId: "the-strongest-todo-list",
  storageBucket: "the-strongest-todo-list.appspot.com",
  messagingSenderId: "62274701085",
  appId: "1:62274701085:web:a1ed5fd64a2a35e1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.getElementById('send').addEventListener('click', () => {
  let list = [];
  document.querySelectorAll('.tag').forEach(elm => {
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
    url: document.getElementById('url').value,
    repository_url: document.getElementById('repository_url').value,
    title: document.getElementById('title').value,
    comment: document.getElementById('comment').value,
    list: list
  }).then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
  }).catch(function(error) {
    console.error("Error adding document: ", error);
  });
});
