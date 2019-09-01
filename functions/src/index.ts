import * as functions from 'firebase-functions';
import * as express from 'express';
import * as admin  from 'firebase-admin';
import * as https from 'https';

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

app.get('/todoLists', async (req, res) => {
    const list = await db.collection('test').get();
    let items:object[] = [];
    list.forEach(item => {
        items.push(Object.assign(item.data(), {
            id: item.id,
            escapeTags: JSON.stringify(item.data().list)
        }));
    });

    res.status(200).render('todoLists', {
        items: items
    });
});

async function fetchGitHubApi(path:string) {
    return new Promise((resolve, reject) => {
        https.get({
            hostname: 'api.github.com',
            path: path,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        },  (res) => {
            res.setEncoding('utf8');
            let body = '';
            res.on('data',  (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                resolve(JSON.parse(body));
            });
        }).on('error', error => {
            reject(error);
        });
    })
}

app.get('/todoLists/:item', async (req, res) => {
    const item = await db.collection('test').doc(req.params.item).get();
    const data:any = item.data();
    const user:any = await admin.auth().getUser(data.uid);
    const gitHubUser = await fetchGitHubApi(`/user/${user.providerData.shift().uid}`);

    res.status(200).render('todoListDetail', {
        item: Object.assign(data, {
            id: item.id,
            escapeTags: JSON.stringify(data.list)
        }),
        user: gitHubUser
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