'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var BlogSchema = new Schema({
	date: Date,
	active: Boolean,
	featured_video: String,
	featured_image: String,
	category: String,
	title: String,
	intro: String,
	main: String,
	slug: String
});

module.exports = mongoose.model('Blog', BlogSchema);
