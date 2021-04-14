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


exports.logout = async (req, res)=>{
    res.cookie('account', 'logout',{
        expires: new Date(Date.now() + 2*1000),
        httpOnly:  true
    });
    res.redirect('/');

}

//middleman
exports.getAccount = async (req, res, next) =>{
    if(req.cookies.account){
        try{
            //vverify token
            const decoded  =  await promisify(jwt.verify)(req.cookies.account, process.env.TOKEN_SECRET);
            
            if(decoded.type == 'User'){
                //check user
                let results = db.query(`SELECT * FROM User WHERE user_id = ?`, [decoded.id]);
                if(results <= 0){
                    console.log("DNE");
                    return next(); //DNE
                }
                req.acc = results[0];
                //console.log("HSAHDHSAHD: " + results[0].user_name_display);
                return next();

            }else if(decoded.type == 'Artist'){
                //check musician
                console.log("YERRR");

                //check user
                let results = db.query(`SELECT * FROM Artist WHERE artist_id = ?`, [decoded.id]);
                if(results <= 0){
                    console.log("DNE");
                    return next(); //DNE
                }
                console.log("EEEE");
                req.acc = results[0];
                //console.log("HSAHDHSAHD: " + results[0].user_name_display);
                return next();
            }


        }catch(error){
            console.log(error);
            return next();
        }
    }else{
        next();
    }
}

exports.register =  (req, res)=>{
    console.log(req.body);
    const { name, username, email, DOB, country, password, password2, biography, fb_url, ig_url, spotify_url, soundcloud_url, personal_url} = req.body;
    let isMusician = req.body.checkbox ? true : false

   
    let results = db.query(`SELECT user_name FROM User WHERE user_name = ?`, [username]);
    if(results.length > 0){
        return res.render('register', {
            message: 'Try again: That username is already in use by another user'
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

    //Not a musician, so create a user account
    if(isMusician === false)
    {
        db2.query(`INSERT INTO User SET ?`, {artist_idF: artist_id, user_id: uniqueId, user_name: username, user_email: email, country: country, age: currAge , user_password: password, user_name_display: name});
        const token = jwt.sign({id: uniqueId, type: 'User'}, process.env.TOKEN_SECRET, {expiresIn: process.env.TOKEN_EXPIRES_IN} );

        const cookieOptions = {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        }
        
        res.cookie('account', token, cookieOptions);
        return res.redirect('/successRegister_User');

    }else{
        
        db2.query(`INSERT INTO Artist SET ?`, {artist_id: uniqueId, artist_name: username, artist_email: email, country: country, background_link: '', website_url: personal_url, artist_password: password, artist_name_display: name, biography: biography, fb_url: fb_url, ig_url: ig_url, spotify_url: spotify_url, soundcloud_url: soundcloud_url, age: currAge });
        const token = jwt.sign({id: uniqueId, type: 'Artist'}, process.env.TOKEN_SECRET, {expiresIn: process.env.TOKEN_EXPIRES_IN} );

        const cookieOptions = {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        }
        
        res.cookie('account', token, cookieOptions);
        
        return res.redirect('/successRegister_Artist');
    }   
        
}

exports.updateArtistProfile = (req, res)=>{
    console.log(req.body);

    const {name, email, DOB, country, password, password2, biography, fb_url, ig_url, spotify_url, soundcloud_url, personal_url, artistId} = req.body;
    const getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10)
    const currAge = getAge(req.body.DOB);


    db2.query(`UPDATE Artist SET ? WHERE ?`, [{country: country}, {artist_id: artistId}], (err)=>{
        if(err){
            console.log('else');
            console.log(err);
        }
    });

    if(name != ''){

        db2.query(`UPDATE Artist SET ? WHERE ?`, [{artist_name_display: name}, {artist_id: artistId}], (err)=>{
            if(err){
                console.log('name');
                console.log(err);
            }
            

        });
    }
    
    if(email != ''){
        console.log("UPDATE EMAIL");

        db2.query(`UPDATE Artist SET ? WHERE ?`, [{artist_email: email}, {artist_id: artistId}], (err)=>{
            if(err){
                console.log('email');
                console.log(err);
            }
            
        });

        console.log("new e: " + email);
    }

    if(password != ''){

        if(password != password2){
            console.log("flash s tart");
            req.flash('error', 'Try again: Passwords do not match');
            console.log("flash end");
            return res.redirect('/editArtistProfile');
        }

        db2.query(`UPDATE Artist SET ? WHERE ?`, [{artist_password: password}, {artist_id: artistId}], (err)=>{
            if(err){
                console.log('pass');
                console.log(err);
            }
        });
        
    }

    if(biography != ''){
        db2.query(`UPDATE Artist SET ? WHERE ?`, [{biography: biography}, {artist_id: artistId}], (err)=>{
            if(err){
                console.log('pass');
                console.log(err);
            }
        });

    }

    if(fb_url != ''){
        db2.query(`UPDATE Artist SET ? WHERE ?`, [{fb_url: fb_url}, {artist_id: artistId}], (err)=>{
            if(err){
                console.log('pass');
                console.log(err);
            }
        });

    }

    if(ig_url != ''){
        db2.query(`UPDATE Artist SET ? WHERE ?`, [{ig_url: ig_url}, {artist_id: artistId}], (err)=>{
            if(err){
                console.log('pass');
                console.log(err);
            }
        });

    }

    if(spotify_url != ''){
        db2.query(`UPDATE Artist SET ? WHERE ?`, [{spotify_url: spotify_url}, {artist_id: artistId}], (err)=>{
            if(err){
                console.log('pass');
                console.log(err);
            }
        });

    }

    if(soundcloud_url != ''){
        db2.query(`UPDATE Artist SET ? WHERE ?`, [{soundcloud_url: soundcloud_url}, {artist_id: artistId}], (err)=>{
            if(err){
                console.log('pass');
                console.log(err);
            }
        });

    }

    if(personal_url != ''){
        db2.query(`UPDATE Artist SET ? WHERE ?`, [{website_url: personal_url}, {artist_id: artistId}], (err)=>{
            if(err){
                console.log('pass');
                console.log(err);
            }
        });

    }

    
    req.flash('success', 'Successfully updated information');
    return res.redirect('/editArtistProfile');

};

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

    }else{
        console.log('name not changing');
        let nameOld = db.query(`SELECT user_name_display FROM User WHERE user_id = ?`, [userId]);
        console.log(nameOld);
    }
    
    if(email != ''){

        db2.query(`UPDATE User SET ? WHERE ?`, [{user_email: email}, {user_id: userId}], (err)=>{
            if(err){
                console.log('email');
                console.log(err);
            }
            
        });
    }else{
        //req.flash('displayName', name);
        let emailOld = db.query(`SELECT user_email FROM User WHERE user_id = ?`, [userId]);

    }

    if(password != ''){

        if(password != password2){
            console.log("flash s tart");
            req.flash('error', 'Try again: Passwords do not match');
            console.log("flash end");
            return res.redirect('/editProfile');
        }

        db2.query(`UPDATE User SET ? WHERE ?`, [{user_password: password}, {user_id: userId}], (err)=>{
            if(err){
                console.log('pass');
                console.log(err);
            }
        });
        
    }

    
    req.flash('success', 'Successfully updated information');
    return res.redirect('/editProfile');

};

exports.login  = (req, res) =>{

    const{username, password} = req.body;
    console.log(req.body);

    if(username == 'admin' && password == 'admin'){
        //redirect to admin page
        return res.redirect('/admin_index');
    }

    //USER
    let results = db.query(`SELECT * FROM User WHERE user_name = ?`, [username]);
    let results2 = db.query(`SELECT * FROM Artist WHERE artist_name = ?`, [username]);
    if(results.length <= 0 && results2.length <=0){
        console.log('DNE');
        return res.render('login', {
            message: 'Try again: Username or password do not match'
        });

    }else{

        if(results.length <= 0){

            //results is empty so results2 has  user = we are  looking at ARTISTS

            const token = jwt.sign({id: results2[0].artist_id, type: 'Artist'}, process.env.TOKEN_SECRET, {expiresIn: process.env.TOKEN_EXPIRES_IN} );

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                
                res.cookie('account', token, cookieOptions);
                return res.redirect('/artist_index');

        }else{
            //user
            const token = jwt.sign({id: results[0].user_id, type: 'User'}, process.env.TOKEN_SECRET, {expiresIn: process.env.TOKEN_EXPIRES_IN} );

            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
                ),
                httpOnly: true
            }
            
            res.cookie('account', token, cookieOptions);
            return res.redirect('/user_index');
        }

    }
};
