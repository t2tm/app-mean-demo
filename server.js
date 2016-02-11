'use strict';

// server.js

// set up ======================================================================

// get all the tools we need
var express      = require('express');
var path         = require('path');
var app          = express();
var _            = require('lodash');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var mongoose     = require('mongoose');
var passport     = require('passport');
var flash        = require('connect-flash');

// get configuration variables
var config = require('./config/environment/index')(_);
var root = path.normalize(__dirname + '/../..'); //get root path
var port = config.port;

// get main server side controller
var blogController = require('./app/controllers/blog-controller');


// configuration ===============================================================

mongoose.connect(config.mongodb.url); // connect to our database

// get passport js strategies for local and 3rd party login
require('./config/passport')(passport, config); // pass passport for configuration

// set up our express application
// app.use(express.logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.set('views', path.join(__dirname, 'client/views'));
app.set('view engine', 'ejs'); // set up ejs for templating

//static resource
app.use(express.static(__dirname + '/client')); // set the static files location

// required for passport
app.use(session({
    secret: "app-mean-demo-secret",
    name: "app-mean-demo-name",
    //store: sessionStore, // connect-mongo session store
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

// use passport js
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// use connect-flash for flash messages stored in session
app.use(flash());


// routes ======================================================================

// get route middleware
var routeMiddleWare = require('./app/routes/middleware');
// require necessary route files
require('./app/routes/main')(app); // load our routes and pass in our app and fully configured passport
require('./app/routes/user')(app, routeMiddleWare.isLoggedIn, passport);
require('./app/routes/blog')(app, routeMiddleWare.isLoggedIn, blogController);


// launch ======================================================================

app.listen(port);
console.log('Web App starts on port ' + port);
