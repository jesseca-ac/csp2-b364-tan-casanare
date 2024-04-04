const express = require("express");
const userController = require("../controllers/user");
const {verify, isLoggedIn, verifyAdmin} = require("../auth");
const router = express.Router();

// User Access routes
router.post("/", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/logout", userController.logoutUser);
router.put('/reset-password', verify, userController.resetPassword);
router.put('/profile', verify, userController.updateProfile);
router.get("/details", verify, userController.getProfile);

// Admin Access routes
router.patch('/:userId/set-as-admin', verify, verifyAdmin, userController.setAdmin);

module.exports = router;