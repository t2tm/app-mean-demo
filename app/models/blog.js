'use strict';

var mongoose = require('mongoose');

// blog schema in json
var blogSchema = mongoose.Schema({
    post_title       : String,
    post_content     : String,
    post_date        : { type: Date, default: Date.now }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Blog', blogSchema);
