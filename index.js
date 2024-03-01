require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const cors = require("cors");



// MongoDB 
mongoose.connect(`${process.env.mongoConnectionString}`); // paste string in .env
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));



// Server Setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));



// Access to backend application
app.use(cors());



// Google SSO Session
app.use(
    session({
        secret: process.env.clientSecret,
        resave: false,
        saveUninitialized: false
    })
);



// Passport initialization and Session
require('./passport');
app.use(passport.initialize());
app.use(passport.session())



// ROUTES START

// User Routes
const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);



// ROUTES END



// Environment Setup
const PORT = process.env.PORT;
if(require.main === module){
	app.listen(process.env.PORT, () => {
		console.log(`API Running on PORT ${process.env.PORT} `)
	});
}

module.exports = app;