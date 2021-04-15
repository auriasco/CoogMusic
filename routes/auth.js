const express = require("express");
const authController = require('../controllers/auth');
const adminController = require('../controllers/dbActions');
const router = express.Router();

//MIDDLEWARE  FUNCTIONS
//use all of the exported functions in the corresponding controllers  file
//authController = uses auth.js in  the controllers folder
//example: /register uses the register function in the auth.js file in the controllers folder
// (exports.register) 

//same for everyone
//POST = updating info in database
//GET = just getting info from db or just getting info in general

router.post('/register', authController.register);
router.post('/updateUserProfile',  authController.updateUserProfile);
router.post('/updateArtistProfile',  authController.updateArtistProfile);
router.post('/login',  authController.login);
router.get('/logout', authController.logout);


//admin
router.get('/viewUsers',  adminController.viewUsers);
router.get('/viewArtistsAdmin', adminController.viewArtists);



module.exports = router;
