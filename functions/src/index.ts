import * as functions from 'firebase-functions';
import * as express from 'express';
import * as admin  from 'firebase-admin';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const app = express();
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const list = await db.collection('test').get();
    let items:object[] = [];
    list.forEach(item => {
        items.push(Object.assign(item.data(), {
            id: item.id
        }));
    });
    res.status(200).render('index', {
        items: items
    });
});

app.get('/item/:item', async (req, res) => {
    const item = await db.collection('test').doc(req.params.item).get();
    res.status(200).render('hoge', {
        item: item.data()
    });
});

app.get('/tags', async (req, res) => {
    const list = await db.collection('test2').get();
    let tags:object[] = [];
    list.forEach(item => {
        tags.push(Object.assign(item.data(), {
            id: item.id
        }));
    });
    res.status(200).render('tags', {
        tags: tags
    });
});

app.get('/tags/:tag', async (req, res) => {
    const tag = await db.collection('test2').doc(req.params.tag).get();
    // todo tagを持つitemを取得するクエリーを書く
    res.status(200).render('fuga', {
        tag: Object.assign(tag.data(), {
            id: tag.id
        })
    });
});


exports.app = functions.https.onRequest(app);