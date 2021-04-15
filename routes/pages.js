const express = require('express');
const router  = express.Router();
const authController = require('../controllers/auth');

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

router.get('/editProfile', authController.getAccount, (req, res)=>{
    if(req.acc){
        res.render('editProfile', {acc: req.acc, error: req.flash('error'), success: req.flash('success')});
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

////////////////////////////////////////////////



module.exports = router;