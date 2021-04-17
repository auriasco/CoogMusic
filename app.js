const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { connect } = require('./routes/pages');
const Connection = require('sync-mysql');
const fs = require("fs");
const { getAudioDurationInSeconds } = require('get-audio-duration');


const exphbs = require('express-handlebars');

//start server
const app  = express();
var sessionStore = new session.MemoryStore;

dotenv.config({
    path: './.env'
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

//Parse URL-encoded bodies (As sen tby HTML forms)

app.use(express.urlencoded({extended: false}));

//values we get from form = JSON. Parse JSON bodies (as sent by API)
app.use(express.json());
app.use(cookieParser());
//app.use(bodyParser.urlencoded({ extended: true }));

//when configuring the app view engine
app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: false,
    helpers: require('./hbsHelpers/handlebars-helpers.js') //only need this
  }));
app.set('view engine', 'hbs'); //template HTML

app.use(fileUpload());
global.db = Connection;

app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));

app.use(flash());

//Routes
app.use('/', require('./routes/pages')); // /login
app.use('/auth', require('./routes/auth')); // /auth/login

app.listen(5000, ()=>{
    console.log("Server started");
});
