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

//User Page
router.get('/successRegister_User', (req, res)=>{
    //name = username, userName = display name 
    //console.log(req.body);
    const test = {name: req.flash('welcomeName'), idUser: req.flash('userId'), displayName: req.flash('userName'), DOB: req.flash('Birth'), country: req.flash('Country'), email: req.flash('email') };
    //console.log('tee');
    console.log(test);
    res.render('successRegister_User', test);
});

router.get('/successRegister_Artist', (req, res)=>{
    //name = username, userName = display name 
    //console.log(req.body);
    const test = {name: req.flash('welcomeName'), idUser: req.flash('userId'), displayName: req.flash('userName'), DOB: req.flash('Birth'), country: req.flash('Country'), email: req.flash('email') };
    //console.log('tee');
    console.log(test);
    res.render('successRegister_Artist', test);
});

router.post('/editProfile', (req,res)=>{
    console.log('POSTGTTT');
    let userInfo = {userId: req.body.idNum, displayName: req.body.displayName, DOB: req.body.DOB, country: req.body.country, email: req.body.email};

    /*
    if(Object.keys(req.flash()).length != 0){
        console.log('KEEEE');
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
    }*/
    res.render('editProfile', userInfo);
    console.log(userInfo);
});

router.get('/editProfile', (req,res)=>{
    console.log('GETTTTTT');
    const userInfo = {userId: req.flash('userId'), displayName: req.flash('displayName'), DOB: req.flash('DOB'), country: req.flash('country'), email: req.flash('email')};
    console.log(userInfo);
    res.render('editProfile', userInfo);
});

/*
router.post('/user_index', (req,res)=>{
    console.log('POST');
    res.render('user_index', {userName: req.get()});
})
*/

router.get('/viewUsers', (req, res)=>{
    //console.log(req.flash('data'));
    console.log('we in here');
    res.render('viewUsers',{userData: req.flash('data')});
    //req.flash('welcomeName',messages);
    //res.render('user_index',{messages: req.flash('welcomeName')});
});


router.get('/admin_index', (req, res)=>{
    console.log('GET');
    res.render('admin_index');
    //req.flash('welcomeName',messages);
    //res.render('user_index',{messages: req.flash('welcomeName')});
});

router.get('/artist_index', (req, res)=>{
    console.log('GET');
    const test = {name: req.flash('welcomeName'), idUser: req.flash('userId'), displayName: req.flash('userName'), country: req.flash('Country'), email: req.flash('email') };
    res.render('artist_index', test);
    //req.flash('welcomeName',messages);
    //res.render('user_index',{messages: req.flash('welcomeName')});
});

router.get('/user_index', (req, res)=>{
    console.log('GET');
    const test = {name: req.flash('welcomeName'), idUser: req.flash('userId'), displayName: req.flash('userName'), country: req.flash('Country'), email: req.flash('email') };
    res.render('user_index', test);
    //req.flash('welcomeName',messages);
    //res.render('user_index',{messages: req.flash('welcomeName')});
});


//Musician Page


module.exports = router;