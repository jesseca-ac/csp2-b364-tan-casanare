require('dotenv').config()
const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth20').Strategy



// This configures Passport to use the Google OAuth 2.0 authentication strategy
passport.use(new GoogleStrategy({
            clientID: process.env.clientID,
            clientSecret: process.env.clientSecret,
            callbackURL: `http://localhost:${process.env.PORT}/users/google/callback`,
            passReqToCallback: true
        },
        function (request, accessToken, refreshToken, profile, done) {
                return done(null, profile);
        }
    )
)



// Serialization and deserialization of Users in Sessions
passport.serializeUser( function(user, done) { done(null, user) })
passport.deserializeUser( function(user, done) { done(null,user) })