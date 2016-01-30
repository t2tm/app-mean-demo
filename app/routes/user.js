// app/routes.js
module.exports = function(app, isLoggedIn, passport) {

	// =====================================
	// login ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('user/login.ejs', { message: req.flash('loginMessage'), user : req.user });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// signup ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('user/signup.ejs', { message: req.flash('signupMessage'), user : req.user });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('user/profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
    // facebook login ======================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
    	})
	);

    // unlink facebook
	app.get('/unlink/facebook', function(req, res) {
	    var user = req.user;
        user.facebook.id = undefined;
	    user.facebook.token = undefined;
        user.facebook.email = undefined;
        user.facebook.name = undefined;
	    user.save(function(err) {
	      res.redirect('/profile')
	    })
	});

	// =====================================
	// weibo login =========================
	// =====================================
	// route for weibo authentication and login
	app.get('/auth/weibo', passport.authorize('weibo'));

	// handle the callback after weibo has authenticated the user
    app.get('/auth/weibo/callback',
		passport.authorize('weibo', {
		    successRedirect: '/profile',
		    failureRedirect: '/'
	   	})
	);

    // unlink weibo
	app.get('/unlink/weibo', function(req, res) {
	    var user = req.user;
        user.weibo.id = undefined;
	    user.weibo.token = undefined;
        user.weibo.displayName = undefined;
        user.weibo.username = undefined;
	    user.save(function(err) {
	      res.redirect('/profile')
	    })
	});

    // =====================================
	// User logout =========================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

};
