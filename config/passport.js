'use strict';

// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var WeiboStrategy = require('passport-weibo').Strategy

// load up the user model
var User = require('../app/models/user');

// load the auth variables
//var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport, configAuth) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

				// if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model

				// save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));

    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))

    // =========================================================================
    // facebook ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({
        // pull in our app id, secret and callback from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields: ["emails", "displayName"],
        passReqToCallback: true //handle facebook connect after user login
    },

    // facebook will send back the token and profile
    function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {
            if (!req.user) {
                // find the user in the database based on their facebook id
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then check 3rd party info and log them in
                    if (user) {
                        // facebook token is missing
                        if (!user.facebook.token) {
                            user.facebook.id = profile.id;
                            user.facebook.token = token;
                            user.facebook.name = profile.name;
                            // save facebook info returned
                            user.save(function(err) {
                                if (err)
                                    throw err;

                                return done(null, user);
                            })
                        }
                        // if user found and nothing goes wrong, and then return that user
                        return done(null, user);
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser            = new User();

                        // set all of the facebook information in our user model
                        newUser.facebook.id    = profile.id; // set the users facebook id
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user
                        newUser.facebook.name  = profile.displayName; // look at the passport user profile to see how names are returned
                        newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                        // save our user to the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }
                });
            }else{
                // user already logs into system
                var user = req.user

                // update user facebook info
                user.facebook.id     = profile.id;
                user.facebook.token  = token;
                user.facebook.name   = profile.displayName;
                user.facebook.email  = profile.emails[0].value;

                // update user
                user.save(function(err) {
                    if (err)
                      throw err;

                    return done(null, user)
                })
            }
        });
    }));

    passport.use(new WeiboStrategy({
        clientID        :    configAuth.weiboAuth.appKey,
        clientSecret    :    configAuth.weiboAuth.appSecret,
        callbackURL     :    configAuth.weiboAuth.callbackURL,
        passReqToCallback: true
    },

    // weibo sends back the token and profile
    function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function () {
            if (!req.user) {
                User.findOne({ 'weibo.id': profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    if (err)
                        return done(err)

                    // if the user is found, then check 3rd party info and log them in
                    if (user) {
                        // weibo token is missing
                        if (!user.weibo.token) {
                            user.weibo.token = token;
                            user.weibo.name = profile.name;

                            // save weibo info into user account
                            user.save(function(err) {
                                if (err)
                                    throw err;
                                // save done well and return user
                                return done(null, user);
                            })
                        }
                        // if user found and nothing goes wrong, and then return that user
                        return done(null, user);
                    } else {
                        // create new user
                        var newUser = new User()

                        // set all of the facebook information in our user model
                        newUser.weibo.id    = profile.id
                        newUser.weibo.token = token
                        newUser.weibo.name  = profile.displayName

                        newUser.save(function(err) {
                            if (err)
                                throw err

                            return done(null, newUser)
                        });
                    }
                });
            } else {
                // user already logs into system
                var user = req.user

                // update user weibo info
                user.weibo.id     = profile.id
                user.weibo.token  = token
                user.weibo.name   = profile.displayName

                // update user
                user.save(function(err) {
                    if (err)
                        throw err

                    return done(null, user)
                });
            }
        });
    }));
};
