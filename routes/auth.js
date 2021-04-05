const express = require("express");
const authController = require('../controllers/auth');

const router = express.Router();

//auth/register auth coming from app.js
router.post('/register', authController.register);
router.post('/updateUserProfile',  authController.updateUserProfile);

module.exports = router;