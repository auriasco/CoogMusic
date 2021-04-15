const express = require("express");
const authController = require('../controllers/auth');
const fileUploadcontroller = require('../controllers/fileUpload');

const router = express.Router();

//auth/register auth coming from app.js
router.post('/register', authController.register);
router.post('/updateUserProfile',  authController.updateUserProfile);
router.post('/login',  authController.login);
router.post('/upload', fileUploadcontroller.upload);
router.get('/viewUsers',  authController.viewUsers);


module.exports = router;