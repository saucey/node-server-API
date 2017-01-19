'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var SocialsSchema = new Schema({
	name: String,
	url: String
});

module.exports = mongoose.model('Socials', SocialsSchema);
