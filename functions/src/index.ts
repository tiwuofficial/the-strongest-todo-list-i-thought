import * as functions from 'firebase-functions';
import * as express from 'express';
import * as admin  from 'firebase-admin';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const app = express();
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const list = await db.collection('test').limit(3).get();
    let items:object[] = [];
    list.forEach(item => {
        items.push(Object.assign(item.data(), {
            id: item.id,
            escapeTags: JSON.stringify(item.data().list)
        }));
    });

    const tagList = await db.collection('test2').orderBy('count', 'desc').limit(8).get();
    let tags:object[] = [];
    tagList.forEach(item => {
        tags.push(Object.assign(item.data(), {
            id: item.id
        }));
    });
    res.status(200).render('index', {
        items: items,
        tags: tags
    });
});

app.get('/create', async (req, res) => {
    res.status(200).render('create');
});

app.get('/item/:item', async (req, res) => {
    const item = await db.collection('test').doc(req.params.item).get();
    const data:any = item.data();
    res.status(200).render('todoListDetail', {
        item: Object.assign(data, {
            id: item.id,
            escapeTags: JSON.stringify(data.list)
        })
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
    const list = await db.collection('test').where('list', 'array-contains', req.params.tag).get();
    let items:object[] = [];
    list.forEach(item => {
        items.push(Object.assign(item.data(), {
            id: item.id,
            escapeTags: JSON.stringify(item.data().list)
        }));
    });
    res.status(200).render('tagDetail', {
        tag: Object.assign(tag.data(), {
            id: tag.id
        }),
        items: items
    });
});

exports.app = functions.https.onRequest(app);