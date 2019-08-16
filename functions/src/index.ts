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

app.get('/api', (req, res) => {
    const date = new Date();
    const hours = (date.getHours() % 12) + 1;  // London is UTC + 1hr;
    res.json({bongs: 'BONG '.repeat(hours)});
});

exports.app = functions.https.onRequest(app);