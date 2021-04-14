const express = require("express");
const authController = require('../controllers/auth');
const adminController = require('../controllers/adminActions');
const router = express.Router();

//auth/register auth coming from app.js
router.post('/register', authController.register);
router.post('/updateUserProfile',  authController.updateUserProfile);
router.post('/updateArtistProfile',  authController.updateArtistProfile);
router.post('/login',  authController.login);
router.get('/logout', authController.logout);


//admin
router.get('/viewUsers',  adminController.viewUsers);
router.get('/viewArtistsAdmin', adminController.viewArtists);



module.exports = router;
