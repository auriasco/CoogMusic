const express = require('express');
const router  = express.Router();

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

//View artists
router.get('/artists', (req,res)=>{
    res.render('artists');
});

//User Page
router.get('/successRegister_User', (req, res)=>{
    //name = username, userName = display name 
    //console.log(req.body);
    const test = {name: req.flash('welcomeName'), idUser: req.flash('userId'), displayName: req.flash('userName'), DOB: req.flash('Birth'), country: req.flash('Country'), email: req.flash('email') };
    //console.log('tee');
    console.log(test);
    res.render('successRegister_User', test);
});

router.post('/editProfile', (req,res)=>{
    let userInfo = {userId: req.body.idNum, displayName: req.body.displayName, DOB: req.body.DOB, country: req.body.country, email: req.body.email};
   
    if(Object.keys(req.flash()).length != 0){
        userInfo.DOB = req.flash('DOB');
        userInfo.userId = req.flash('userId');
        userInfo.country = req.flash('country');

        if(Object.keys(req.flash('email')).length != 0){
            userInfo.email = req.flash('email');
        }

        if(Object.keys(req.flash('displayName')).length != 0){
            userInfo.displayName = req.flash('displayName');
        }
        //add message
    }
    res.render('editProfile', userInfo);
    console.log(userInfo);
});

router.get('/editProfile', (req,res)=>{
    res.render('editProfile');
});

/*
router.post('/user_index', (req,res)=>{
    console.log('POST');
    res.render('user_index', {userName: req.get()});
})
*/


router.get('/user_index', (req, res)=>{
    console.log('GET');
    res.render('user_index');
    //req.flash('welcomeName',messages);
    //res.render('user_index',{messages: req.flash('welcomeName')});
});


//Musician Page


module.exports = router;