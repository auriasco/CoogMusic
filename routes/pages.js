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
    console.log('GET');
    res.render('admin_index');
    //req.flash('welcomeName',messages);
    //res.render('user_index',{messages: req.flash('welcomeName')});
});

////////////////////////////////////////////////



//////////////// ARTIST PAGE ////////////////
router.get('/editArtistProfile', authController.getAccount, (req, res)=>{
    if(req.acc){
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




module.exports = router;
