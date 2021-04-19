const express = require('express');
const router  = express.Router();
const dbService = require('../controllers/dbService');
const authController = require('../controllers/auth');

const mysql = require('sync-mysql');
const mysqladd = require('mysql2');

/* Middleware functions included:
exports.viewUsers
exports.viewArtists

*/



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


//Homepage
router.get('/', (req,res)=>{
    res.render('index');
});

//Register Page
router.get('/register', (req,res)=>{
    res.render('register');
});

//Login Page
router.get('/login', (req,res)=>{
    res.render('login');
});

//User Page
router.get('/getNotifications', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getNotifications();
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

router.get('/getSongDisplays', authController.getAccount, (request, response)=>{
    const db = dbService.getDbServiceInstance();
    const result = db.getSongDisplays();
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
});

/*
USE OF COOKIES: authController.getAccount = the middleware function to  get the cookies
the getAccount exported function in the auth.js file in the CONTROLLERS folder.

how it works: if user/artist clicks on the edit profile button for example,
will first go to the middleware function that gets the cookies from the browser.
(whenever you login or register, a cookie will be registered automatically)
This cookie is called req.acc
req.acc will contain the identifying info of the user or artist's id and ttheir type (user or artist)
Useful because since we now have their id, we can access their stuff in the database/
req.acc will give us everything in the arttist or user table associated with that id.
Ex- req.acc (we are looking at artists) will give us all their info from the table
such as their display name, username, social media links, etc.

*/

//////////////// ARTIST PAGE ////////////////
router.get('/editArtistProfile', authController.getAccount, (req, res)=>{
    if(req.acc){
        //get the cookie info and store it in a variable named acc.
        //Then in the hbs files, we can get the info using {{acc.artist_name}}, etc.
        //error and success are flashes sent by the edit artist profile function in the auth.js file in
        //the CONTROLLERS folder. Error = passwords dont match, etc. 
        //It gets put in here as well because when you press submit (to  edit your info),
        //it goes to /auth/editArtistProfile => redirects back to /editArtistProfile when
        //finished updating or it catches an error

        res.render('editArtistProfile', {acc: req.acc, error: req.flash('error'), success: req.flash('success')});
    }else{
        res.redirect('/login');
    }
});

router.get('/successRegister_Artist', authController.getAccount, (req, res)=>{
    if(req.acc){
        res.render('successRegister_Artist', {acc: req.acc});
    }else{
        res.redirect('/login');
    }
});


router.get('/artist_index', authController.getAccount, (req, res)=>{
    if(req.acc){
        res.render('artist_index', {acc: req.acc});
    }else{
        res.redirect('/login');
    }
});

//Artist Music Page
// router.get('/viewMusicArtist', (req, res) =>{
//     console.log('Get');
//     res.render('viewMusicArtist');
// });

//Upload Music

router.get('/uploadMusic', authController.getAccount, (req, res) =>{

    if(req.acc){
        res.render('uploadMusic', {acc: req.acc});
    }else{
        res.redirect('/login');
    }
});


////////////////////////////////////////////////


//////////////// USER PAGE ////////////////////////////////

router.get('/successRegister_User', authController.getAccount, (req, res)=>{

    if(req.acc){
        res.render('successRegister_User', {acc: req.acc});
    }else{
        res.redirect('/login');
    }

});

router.get('/user_index', authController.getAccount, (req, res)=>{
    if(req.acc){
        res.render('user_index', {acc: req.acc});
    }else{
        res.redirect('/login');
    }
});

router.get('/viewArtists', authController.getAccount, (req, res)=>{
    if(req.acc){
        let artists = db.query(`SELECT * FROM Artist`);
        res.render('viewArtists', {acc: req.acc, artistData: artists});
    }else{
        res.redirect('/login');
    }
});

router.get('/viewMusicArtist', authController.getAccount, (req, res)=>{
    if(req.acc){
        let songs = db.query(`SELECT * FROM Song`);
        res.render('viewMusicArtist', {acc: req.acc, songData: songs});
    }else{
        res.redirect('/login');
    }
});

router.get('/getSongs', authController.getAccount, (req, res)=>{
    if(req.acc){
        let songs = db.query(`SELECT * FROM Song`);
        console.log(songs);
    }else{
        res.redirect('/login');
    }
});

router.get('/editProfile', authController.getAccount, (req, res)=>{
    if(req.acc){
        res.render('editProfile', {acc: req.acc, error: req.flash('error'), success: req.flash('success')});
    }else{
        res.redirect('/login');
    }
});

//User just clicked the artist profile OR they clicked the follow or unfollow button
router.post('/artistProfile/:artistId', authController.getAccount, (req, res)=>{
    if(req.acc){
        //get artist info
        const artist_id = req.params.artistId;
        let artistInfo = db.query(`SELECT * FROM Artist WHERE artist_id = ?`,[artist_id]);
        var following = false;

        //Check if following
        let checkFollowing = db.query(`SELECT idfollow FROM Follow WHERE followed_by_user_id = ? AND following_artist_id = ?`, [req.acc.user_id, artistInfo[0].artist_id]);
        
        if(checkFollowing.length == 1){
            //user is following
            following = true;

            if(req.body.pressedUnfollow == ''){
                db2.query(`DELETE FROM Follow WHERE ? AND ?`,[{followed_by_user_id: req.acc.user_id} , {following_artist_id: artistInfo[0].artist_id}]);

                //need to recall a query to update follower count
                artistInfo = db.query(`SELECT * FROM Artist WHERE artist_id = ?`,[artist_id]);
                following = false;
            }
        }else if(req.body.pressedFollow == ''){
            db2.query(`INSERT INTO Follow SET ?`, {followed_by_user_id: req.acc.user_id, following_artist_id: artistInfo[0].artist_id});
            
            //need to recall a query to update follower count
            artistInfo = db.query(`SELECT * FROM Artist WHERE artist_id = ?`,[artist_id]);
            //console.log('CLOUT COUNT: '+ artistInfo[0].followerCount);
            following = true;
        }

        res.render('artistProfile', {acc: req.acc, artistData: artistInfo[0], following: following});
    }else{
        res.redirect('/login');
    }
});


////////////////////////////////////////////////

//////////////// ADMIN PAGE ////////////////////////////////
router.get('/viewUsers', (req, res)=>{
    res.render('viewUsers',{userData: req.flash('data')});
});

router.get('/viewArtistsAdmin', (req, res)=>{
    res.render('viewArtistsAdmin',{artistData: req.flash('data')});
});

router.get('/admin_index', (req, res)=>{
    res.render('admin_index');
});

//User Music Page
router.get('/viewMusicUser', (req, res) =>{
    console.log('Get');
    res.render('viewMusicUser');
});


////////////////////////////////////////////////

module.exports = router;
