import * as functions from 'firebase-functions';
import * as express from 'express';
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.status(200).render("index",
        {
            items: [
                {name: "<h1>リンゴ</h1>"},
                {name: "<h2>バナナ</h2>"},
                {name: "<h3>スイカ</h3>"}
            ]
        }
    );
});

app.get('/hoge', (req, res) => {
    res.status(200).render('hoge');
});

app.get('/api', (req, res) => {
    const date = new Date();
    const hours = (date.getHours() % 12) + 1;  // London is UTC + 1hr;
    res.json({bongs: 'BONG '.repeat(hours)});
});

exports.app = functions.https.onRequest(app);