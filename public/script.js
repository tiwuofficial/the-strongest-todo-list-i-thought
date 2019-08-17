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
const db = firebase.firestore();

document.getElementById('send').addEventListener('click', async () => {
  const files = document.getElementById('file').files;
  const image = files[0];
  await firebase.storage().ref().child(image.name).put(image);
  const imageUrl = await firebase.storage().ref().child(image.name).getDownloadURL();

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
    list: list,
    imageUrl: imageUrl
  });
});
