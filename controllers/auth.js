const jwt = require('jsonwebtoken');
const mysql = require('sync-mysql');
const mysqladd = require('mysql2');
const { v4: uuidv4 } = require('uuid');
const e = require('express');
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


/*
async function userExistsCheck(tableUserVar, tableName, testVal){
    try{
        db.promise().query(`SELECT ${tableUserVar} FROM ${tableName} WHERE ${tableUserVar} = ?`, [testVal],(err, results)=>{
            if(err){
                console.log('i wanna die');
                console.log(err);
                return false;
            }

            if(results.length > 0){
                console.log('exists');
                return true;
            }
        })
        
    }catch(err){
        console.log(err);
        return false;
    }
}
*/

exports.register =  (req, res)=>{
    console.log(req.body);

    const { name, username, email, DOB, country, password, password2} = req.body;
    let isMusician = req.body.checkbox ? true : false

    let results = db.query(`SELECT user_name FROM User WHERE user_name = ?`, [username]);
    if(results.length > 0){
        return res.render('register', {
            message: 'Try again: That username is already in use'
        });
    }

    results = db.query(`SELECT artist_name FROM Artist WHERE artist_name = ?`, [username]);
    if(results.length > 0){
        return res.render('register', {
            message: 'Try again: That username is already in use by musician'
        });
    }

    if(password != password2){
        return res.render('register', {
            message: 'Try again: Passwords do not match'
        });
    }
 
    const uniqueId = uuidv4();
    const getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10)
    const currAge = getAge(DOB);

    const artist_id = 0; //SET TO 0 RN CHANGE LATER

    //Not a musician 
    if(isMusician === false)
    {
        db2.query(`INSERT INTO User SET ?`, {artist_idF: artist_id, user_id: uniqueId, user_name: username, user_email: email, country: country, age: currAge , user_password: password, user_name_display: name});
        req.flash('welcomeName', username);
        req.flash('userId', uniqueId);
        req.flash('userName', name);
        req.flash('Birth',DOB);
        req.flash('Country',country);
        req.flash('email',email);
        return res.redirect('/successRegister_User');
        //return res.render('register', {
        //    message: 'User registered' 
        // });


    }else{
        db2.query(`INSERT INTO Artist SET ?`, {artist_id: uniqueId, artist_name: username, artist_email: email, country: country, background_link: 'null', website_url: 'null', artist_password: password, artist_name_display: name});
        return res.render('register', {
            message: 'Musician registered' 
         });
    }   
        
}

exports.updateUserProfile = (req, res)=>{
    console.log(req.body);

    const {name, email, DOB, country, password, password2, userId} = req.body;
    const getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10)
    const currAge = getAge(req.body.DOB);


    db2.query(`UPDATE User SET ? WHERE ?`, [{country: country}, {user_id: userId}], (err)=>{
        if(err){
            console.log('else');
            console.log(err);
        }
    });

    if(name != ''){

        db2.query(`UPDATE User SET ? WHERE ?`, [{user_name_display: name}, {user_id: userId}], (err)=>{
            if(err){
                console.log('name');
                console.log(err);
            }
        });
        
    }
    
    if(email != ''){

        db2.query(`UPDATE User SET ? WHERE ?`, [{user_email: email}, {user_id: userId}], (err)=>{
            if(err){
                console.log('email');
                console.log(err);
            }
        });

    }

    if(password != ''){

        db2.query(`UPDATE User SET ? WHERE ?`, [{user_password: password}, {user_id: userId}], (err)=>{
            if(err){
                console.log('pass');
                console.log(err);
            }
        });
        
    }

    /*
    req.flash('welcomeName', username);
    req.flash('userId', uniqueId);
    req.flash('userName', name);
    req.flash('Birth',DOB);
    req.flash('Country',country);
    req.flash('email',email);
    */
    return res.redirect('/editProfile');


    


    /*
    const data = req.body;
    let updateVals = {};
    Object.keys(data).forEach((prop)=>{
        if(req.body[prop] != ''){
            if(prop == '')
            updateVals[prop] = req.body[prop];
        }
    });

    updateVals['age'] = currAge;

    console.log(updateVals);


    db2.query(`UPDATE User SET ? WHERE user_id = ?`, [{},{user_id: updateVals.userId}])
    */

    //db2.query(
        //`UPDATE User SET user_email = COALESCE(${email}, user_email), country = COALESCE(${country}, country), age = COALESCE(${currAge}, age), user_password = COALESCE(${password}, user_password), user_name_display = COALESCE(${name}, user_name_display) WHERE user_id = ${userId} AND (${email} IS NOT NULL AND ${email} IS DISTINCT FROM user_email) OR (${country} IS NOT NULL AND ${country} IS DISTINCT FROM country) OR (${currAge} IS NOT NULL AND ${currAge} IS DISTINCT FROM age) OR (${password} IS NOT NULL AND ${password} IS DISTINCT FROM user_password) OR (${name} IS NOT NULL AND ${name} IS DISTINCT FROM user_name_display));` 
    //    `UPDATE User SET user_email = ${email}, country = ${country}, age = ${currAge}, user_password = ${password}, user_name_display = ${name} WHERE user_id = ${userId} AND (${email} IS NOT NULL) OR (${country} IS NOT NULL) OR (${currAge} IS NOT NULL) OR (${password} IS NOT NULL) OR (${name} IS NOT NULL);` 
    //    );

}