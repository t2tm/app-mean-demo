'use strict';

// app/routes.js
module.exports = function(app) {

	// =====================================
	// home page ===========================
	// =====================================
	app.get('/', function(req, res) {
		res.render('index/index.ejs', { user : req.user }); // load the index.ejs file
	});

};
