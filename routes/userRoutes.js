const express = require("express");
const passport = require('passport');
const userController = require("../controllers/userControllers");
const {verify, isLoggedIn} = require("../auth");
const router = express.Router();


// User Access routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post('/reset-password', verify, userController.resetPassword);
router.get("/logout", userController.logoutUser);


// Get user details and update user details
router.get("/profile", verify, userController.getProfile);
router.put('/profile', verify, userController.updateProfile);









// Google SSO Routes
router.get('/google', passport.authenticate('google', { scope:['email', 'profile'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/users/failed' }), function (req, res) { res.redirect('/users/success') });

router.get("/failed", (req, res) => { res.status(401).send({ message: "Google Authentication Failed" })});

router.get("/success", isLoggedIn, (req, res) => { res.status(200).send({ message: "Google Authentication Successful" })});



module.exports = router;