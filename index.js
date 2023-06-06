import express, { query } from 'express';
import path, { resolve } from 'path';
import {route} from './router.js'
import bodyParser from 'body-parser';
import session from 'express-session';
import flash from 'connect-flash'
import pdf from 'html-pdf'

const PORT = 8080;
const app = express();

const durasi = 1000 * 60 * 60 * 1;

app.use(session({
	secret: 'secret',
	resave: true,
	cookie: {maxAge : durasi},
	saveUninitialized: true
}));

app.use(flash())
app.use(route)

const publicPath = path.resolve('public');
app.use(express.static(publicPath));


app.set('view engine','ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

