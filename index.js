const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
require('./passport');
const cors = require("cors");
require('dotenv').config()


mongoose.connect(`mongodb+srv://${process.env.mongoUsername}:${process.env.mongoPassword}@cluster0.ta9wa.mongodb.net/database?retryWrites=true&w=majority`);
mongoose.connection.once('open', () => console.log('Successfully connected to MongoDB'));


const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());


const userRoutes = require("./routes/userRoutes");


app.use("/users", userRoutes);




module.exports = app;