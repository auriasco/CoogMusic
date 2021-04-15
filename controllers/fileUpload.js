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


exports.Upload = function(req, res){
    message = '';
    if(req.method == "POST"){
        var post  = req.body;
        var song_Name= post.songName;
        var artist_Name= post.artistName;
        var album_Name= post.albumName;
        var release_Date= post.releaseDate;

    if(req.method == "POST"){
        if (!req.files)
            return res.status(400).send('No files were uploaded.');
    
        var file_Img = req.files.uploaded_image;
        var img_name = file_Img.name;
        var file_Audio = post.fileAudio;
        var audio_name = file_Audio.name;

        if(file_Img.mimetype == "image/jpeg" ||file_Img.mimetype == "image/png"||file_Img.mimetype == "image/gif" ){
                                    
            file_Img.mv('public/song_images/'+file_Img.name, function(err) {
                                
                if (err)
                    return res.status(500).send(err);
                var sql = "INSERT INTO `Song`(`song_name`,`artist_name`,`album_name`,`release_date`, `song_img_path`) VALUES ('" + song_Name + "','" + artist_Name + "','" + album_Name + "','" + release_Date + "','" + img_name + "')";
    
                var query = db.query(sql, function(err, result) {
                res.redirect('profile/'+result.insertId);
                    });
            });

            file_Audio.mv('public/song_audio/'+file_Audio.name, function(err){
                if(err)
                    return res.status(500).send(err);
                
                var sql = "INSERT INTO `Song`(`song_mp3_path`"
            });


        } 
        else{
            message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
            res.render('index.ejs',{message: message});
        }
    }   
    else{
        res.render('index');
    }
    
    }

};