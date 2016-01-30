// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var path = require('path');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var blogController = require('./app/controllers/blog-controller');
var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

// get passport js strategies for local and 3rd party login
require('./config/passport')(passport); // pass passport for configuration

// main config function
app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	//app.use(express.bodyParser()); // get information from html forms
    app.use(express.urlencoded())
    app.use(express.json())

	app.set('views', path.join(__dirname, 'client/views'));
	app.set('view engine', 'ejs'); // set up ejs for templating

	//static resource
	app.use(express.static(__dirname + '/client')); // set the static files location

	// required for passport
	app.use(express.session({ secret: 'selfstudy' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
});

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
