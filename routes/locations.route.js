'use strict';
var Locations = require('../models/locations.model');
var express = require('express');
var _ = require('lodash');
var router = express.Router();


router.route('/locations').post(function(req, res, next) {

	Locations.find({title: new RegExp('^' + req.body.search, 'i')}, function(err, doc) {
		return res.status(200).json({data: _.slice(doc, 0, 20)});
	});

});

router.route('/locationscities').post(function(req, res, next) {

	var country = req.body.search.country
	var city = req.body.search.city

	Locations.findOne({iso_code: country}, function(err, results) {
		if (results !== null) {
			var new_results = _.uniq(results.cities).filter(function(item) {
				return item.match(new RegExp('^' + city, 'i'));
			});
			return res.status(200).json({data: _.slice(new_results, 0, 20)});
		}

	});
});

module.exports = router;

