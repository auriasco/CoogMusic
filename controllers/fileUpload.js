const jwt = require('jsonwebtoken');
const mysql = require('sync-mysql');
const mysqladd = require('mysql2');
const { v4: uuidv4 } = require('uuid');
const e = require('express');
const fs = require('fs');
//const flash = require('connect-flash');


//use db for queries, don't need to update anything
const db = new mysql({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT 
});

//use db2 if need to update the actual database (registering account, updating info, etc.)
const db2 = mysqladd.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT 
});


exports.upload = function(req, res){
    console.log("ADFAFADF");
    var post  = req.body;
    var song_Name= post.songName;
    var artist_Name= post.artistName;
    var album_Name= post.albumName;
    var release_Date= post.releaseDate;
    var artistId = post.artistId;

    if (!req.files){
        message = "No files were uploaded!";
        res.render('uploadMusic.hbs',{message: message});
    }

    
    
    //get file stuff
    var file_Img = req.files.songImg;
    var img_name = file_Img.name;
    var file_Audio = req.files.songMP3;
    var audio_name = file_Audio.name;

    var songId = uuidv4();

    var song_audio_path = songId + "." + "mp3";

    if (file_Img.mimetype == "image/jpeg"){
        var song_img_path = songId + "." + "jpeg";
    }
    else{
        var song_img_path = songId + "." + "png";
    }

    //testing figure out later
    var album_idB = 0;
    var genre_idB = 0;
    var songDur = 0;
    var plays = 0;

    //foreign keys = genre_idB, album_idB, artist_idB

    if(file_Img.mimetype == "image/jpeg" || file_Img.mimetype == "image/png" ){

                                    
        file_Img.mv('public/song_images/'+ file_Img.name, function(err) {
                            
            if (err)
                return res.status(500).send(err);

            db2.query(`INSERT INTO Song SET ?`,{song_name: song_Name, artist_idB: artistId, artist_name: artist_Name, genre_idB: genre_idB, song_id: songId, release_date: release_Date, song_duration: songDur, plays: plays, song_audio_path: song_audio_path, song_img_path: song_img_path});
   
        });

        
        file_Audio.mv('public/song_audio/'+file_Audio.name, function(err){
            if(err)
                return res.status(500).send(err);

            
        });
        

    }else{
        message = "This format is not allowed , please upload file with '.png','.jpg'";
        res.render('uploadMusic',{message: message});
    }
    
};