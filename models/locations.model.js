'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var LocationSchema = new Schema({
	title: String,
	iso_code: String,
	cities: [String],
});

module.exports = mongoose.model('Cities', LocationSchema);
