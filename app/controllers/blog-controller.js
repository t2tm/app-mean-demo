'use strict';

// get blog schema
var Blog = require('../models/blog');

// create blog entry
module.exports.create = function (req, res) {
  var blog = new Blog(req.body);
  blog.save(function (err, result) {
    res.json(result);
  });
}

// blog listing
module.exports.list = function (req, res) {
  Blog.find({}, function (err, results) {
    res.json(results);
  });
}
