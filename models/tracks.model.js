'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var TracksSchema = new Schema({
	name: String
});

module.exports = mongoose.model('Tracks', TracksSchema);
