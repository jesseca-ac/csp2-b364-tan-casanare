# README
Capstone 2 Project - Backend API Server
by Jesseca and Robert

- add Google SSO clientID and clientSecret in .env
- add MongoDB connection string in .env
- record change logs below in chronological order, newest first


## Change Logs

### March 2

- Logged by Jesseca
- POST /set-admin route and controller completed
- GET /user to for admins to get other user profiles completed
- GET /profile for non admins to get own profile details completed
- Tests successful, no conflicts
- s50 tasks completed


### March 1

- Logged by Jesseca
- Folders routes, controllers, models created
- Files .gitignore, .env.sample, package.json, auth.js, passport.js, userRoutes.js, userControllers.js, User.js created
- Added the following dependencies: express, express-session, mongoose, dotenv, cors, bcrypt, jsonwebtoken, passport, passport-google-auth, passport-google-oauth20
- Authentication: auth.js, passport.js, Google SSO completed
- Users: model completed, routes and controllers for the following are completed - register, login, logout, reset password, get profile, update profile, Google SSO routes
- Index: dependencies required, express and server environment, google sso and passport sessions, mongodb connection, dedicated area for route groupings
- Tests: mongoDB connection successful, no dependency issues, no conflicts

