const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

//start server
const app  = express();

dotenv.config({
    path: './.env'
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

//Parse URL-encoded bodies (As sen tby HTML forms)

app.use(express.urlencoded({extended: false}));

//values we get from form = JSON
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'hbs'); //template HTML

app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

//Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(5000, ()=>{
    console.log("Server started");
});
