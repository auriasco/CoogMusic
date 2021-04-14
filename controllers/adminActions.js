const jwt = require('jsonwebtoken');
const mysql = require('sync-mysql');
const mysqladd = require('mysql2');
const { v4: uuidv4 } = require('uuid');
const e = require('express');
const { async } = require('q');
const { promisify } = require ('util');
//const flash = require('connect-flash');


//database
const db = new mysql({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT 
});

const db2 = mysqladd.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT 
});

exports.viewUsers = (req, res)=>{

    let users = db.query(`SELECT * FROM User`);
    //console.log(users);
    req.flash('data', users);
    return res.redirect('/viewUsers');
}

exports.viewArtists = (req, res)=>{

    let artists = db.query(`SELECT * FROM Artist`);
    req.flash('data', artists);
    return res.redirect('/viewArtistsAdmin');
}
