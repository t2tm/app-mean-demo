'use strict';

// app/routes.js
module.exports = function(app, isLoggedIn, blogController) {

	// =====================================
	// Simple Blog =========================
	// =====================================
	app.get('/blog', isLoggedIn, function(req, res) {
		res.render('index/blog', { user : req.user });
	});

	// simple blog entry data handle
	app.get('/api/blog', blogController.list);
	app.post('/api/blog', isLoggedIn, blogController.create);
};
