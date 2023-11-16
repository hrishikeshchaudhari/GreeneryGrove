const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User1 = require('../models/local_auth_model.js');
const User2 = require('../models/auth_model.js');
const keys = require('./keys.js');
const { compareSync } = require('bcrypt');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user1 = await User1.findById(id);
        if (user1) {
            return done(null, user1);
        }
        const user2 = await User2.findById(id);
        return done(null, user2);
    } catch (err) {
        done(err);
    }
});

passport.use(new LocalStrategy({
    usernameField: "user_name",
    passwordField: "password"
}, async (user_name, password, done) => {
    try {
        const user = await User1.findOne({ user_name });
        if (!user || !compareSync(password, user.password)) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

passport.use(new GoogleStrategy({
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
    try {
        User1.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser){
                // already have this user
                console.log('user is: ', currentUser);
                done(null,currentUser)
                // do something
            } else {
                // if not, create user in our db
                new User1({
                    username: profile.displayName,
                    googleId: profile.id
                }).save().then((newUser) => {
                    console.log('created new user: ', newUser);
                    // do something
                    done(null,newUser)
                });
            }
        });
        // If the user doesn't exist, you can create a new User2 here if needed
        // Example:
        // const newUser2 = await new User2({
        //     googleId: profile.id,
        //     username: profile.displayName,
        // }).save();
        // return done(null, newUser2);
    } catch (err) {
        done(err);
    }
}));
