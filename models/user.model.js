'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: String,
	email: String,
	password: String,
	active: Boolean,
	slug: String,
	social: [{
		name: String,
		url: String
	}],
	bio: [{
		artist_name: String,
		genres: String,
		country: String,
		city: String,
		iso_code: String,
		img: String,
		label: String,
		intro: String,
		content: String,
		slug: String,
		featured_video: String
	}],
	gallery: [{
		img: String
	}],
	events: [{
		date: Date,
		event: String,
		citylocation: String,
		countrylocation: String,
		iso_code: String
	}],
	upload_folder_name: String,
	upload_bio_folder: String,
	roles: {
		name: String
	},
	modules: [{
		name: String
	}]
});

module.exports = mongoose.model('Users', UserSchema);
