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
    imageUrl: imageUrl,
    uid: firebase.auth().currentUser.uid
  });
});
