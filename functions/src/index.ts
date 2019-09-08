import * as functions from 'firebase-functions';
import * as express from 'express';
import * as admin  from 'firebase-admin';
// import * as https from 'https';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const app = express();
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const list = await db.collection('todolists').limit(3).get();
    const items:object[] = [];
    list.forEach(item => {
        items.push(Object.assign(item.data(), {
            id: item.id,
            escapeTags: JSON.stringify(item.data().list)
        }));
    });

    const tagList = await db.collection('tags').orderBy('count', 'desc').limit(8).get();
    const tags:object[] = [];
    tagList.forEach(item => {
        tags.push(Object.assign(item.data(), {
            id: item.id
        }));
    });

    const seo = {
        title: 'My Best Todo List - Share The my best Todo List site',
        type: 'website',
        url: 'https://the-my-best-todo-list.site' + req.url,
        description: 'This site was created to share the my best todo list that I created.Also created to learn from the todo list created by others.If you like, please post the created todo list.'
    };

    res.status(200).render('index', {
        items: items,
        tags: tags,
        seo: seo
    });
});

app.get('/create', async (req, res) => {
    const seo = {
        title: 'My Best Todo List - Share The my best Todo List site',
        type: 'article',
        url: 'https://the-my-best-todo-list.site' + req.url,
        description: 'This site was created to share the my best todo list that I created.Also created to learn from the todo list created by others.If you like, please post the created todo list.',
    };

    res.status(200).render('create', {
        seo: seo
    });
});

app.get('/todoLists', async (req, res) => {
    const list = await db.collection('todolists').get();
    const items:object[] = [];
    list.forEach(item => {
        items.push(Object.assign(item.data(), {
            id: item.id,
            escapeTags: JSON.stringify(item.data().list)
        }));
    });

    const seo = {
        title: 'My Best Todo List - Share The my best Todo List site',
        type: 'article',
        url: 'https://the-my-best-todo-list.site' + req.url,
        description: 'This site was created to share the my best todo list that I created.Also created to learn from the todo list created by others.If you like, please post the created todo list.',
    };

    res.status(200).render('todoLists', {
        items: items,
        seo: seo
    });
});

// async function fetchGitHubApi(path:string) {
//     return new Promise((resolve, reject) => {
//         https.get({
//             hostname: 'api.github.com',
//             path: path,
//             headers: { 'User-Agent': 'Mozilla/5.0' }
//         },  (res) => {
//             res.setEncoding('utf8');
//             let body = '';
//             res.on('data',  (chunk) => {
//                 body += chunk;
//             });
//             res.on('end', () => {
//                 resolve(JSON.parse(body));
//             });
//         }).on('error', error => {
//             reject(error);
//         });
//     })
// }

app.get('/todoLists/:item', async (req, res) => {
    const item = await db.collection('todolists').doc(req.params.item).get();
    const data:any = item.data();
    const user:any = await admin.auth().getUser(data.uid);
    // const gitHubUser = await fetchGitHubApi(`/user/${user.providerData.shift().uid}`);

    const seo = {
        title: 'My Best Todo List - Share The my best Todo List site',
        type: 'article',
        url: 'https://the-my-best-todo-list.site' + req.url,
        description: 'This site was created to share the my best todo list that I created.Also created to learn from the todo list created by others.If you like, please post the created todo list.',
    };

    res.status(200).render('todoListDetail', {
        item: Object.assign(data, {
            id: item.id,
            escapeTags: JSON.stringify(data.list)
        }),
        user: user,
        seo: seo
    });
});

app.get('/tags', async (req, res) => {
    const list = await db.collection('tags').get();
    const tags:object[] = [];
    list.forEach(item => {
        tags.push(Object.assign(item.data(), {
            id: item.id
        }));
    });

    const seo = {
        title: 'My Best Todo List - Share The my best Todo List site',
        type: 'article',
        url: 'https://the-my-best-todo-list.site' + req.url,
        description: 'This site was created to share the my best todo list that I created.Also created to learn from the todo list created by others.If you like, please post the created todo list.',
    };

    res.status(200).render('tags', {
        tags: tags,
        seo: seo
    });
});

app.get('/tags/:tag', async (req, res) => {
    const tag = await db.collection('tags').doc(req.params.tag).get();
    const list = await db.collection('todolists').where('list', 'array-contains', req.params.tag).get();
    const items:object[] = [];
    list.forEach(item => {
        items.push(Object.assign(item.data(), {
            id: item.id,
            escapeTags: JSON.stringify(item.data().list)
        }));
    });

    const seo = {
        title: `My Best Todo List - ${req.params.tag} tag the my best Todo List site.`,
        type: 'article',
        url: 'https://the-my-best-todo-list.site' + req.url,
        description: 'This site was created to share the my best todo list that I created.Also created to learn from the todo list created by others.If you like, please post the created todo list.',
    };

    res.status(200).render('tagDetail', {
        tag: Object.assign(tag.data(), {
            id: tag.id
        }),
        items: items,
        seo: seo
    });
});

interface funcs {
    generateThumbnail: string;
    [key: string]: string;
}

const loadFunctions = (funcsObj:funcs) => {
    console.log('loadFunctions ' + process.env.FUNCTION_NAME);
    for (const name in funcsObj) {
        // 全文じゃなくて前方一致にする
        // if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === name) {
        if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME.startsWith(name)) {
            exports[name] = require(funcsObj[name])
        }
    }
};

loadFunctions({
    generateThumbnail: './generateThumbnail',
});

exports.app = functions.https.onRequest(app);