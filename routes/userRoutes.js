const express = require("express");
const passport = require('passport');
const userController = require("../controllers/userControllers");
const {verify, isLoggedIn} = require("../auth");


const router = express.Router();



module.exports = router;