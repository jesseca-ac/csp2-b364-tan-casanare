const express = require("express");
const passport = require('passport');
const userController = require("../controllers/userControllers");
const {verify, isLoggedIn, verifyAdmin} = require("../auth");
const router = express.Router();


// User Access routes
router.post("/", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/logout", userController.logoutUser);
router.patch('/update-password', verify, userController.resetPassword);


// Get user details and update user details
router.get("/details", verify, userController.getProfile);
router.patch('/details', verify, userController.updateProfile);


// Admin Access routes
router.patch('/set-as-admin', verify, verifyAdmin, userController.setAdmin);
router.get("/user", verify, verifyAdmin, userController.getUser); // GET other user's data


// Google SSO Routes
router.get('/google', passport.authenticate('google', { scope:['email', 'profile'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/users/failed' }), function (req, res) { res.redirect('/users/success') });

router.get("/failed", (req, res) => { res.status(401).send({ message: "Google Authentication Failed" })});

router.get("/success", isLoggedIn, (req, res) => { res.status(200).send({ message: "Google Authentication Successful" })});



module.exports = router;