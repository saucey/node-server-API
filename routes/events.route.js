'use strict';
var Users = require('../models/user.model');
var express = require('express');
var router = express.Router();

router.route('/event-create').post(function(req, res, next) {

	Users.findOne({_id: req.body.data.id}, function(err, doc) {
		var d = {
			date: req.body.data.date,
			event: req.body.data.event,
			citylocation: req.body.data.citylocation,
			countrylocation: req.body.data.countrylocation,
			iso_code: req.body.data.iso_code
		};

		doc.events.push(d);
		doc.save();

		return res.status(200).json({success: true});
	});
});

router.route('/events').post(function(req, res, next) {

	Users.findOne({_id: req.body.userId}, function(err, doc) {
		var evnts = doc.events;
		return res.status(200).json({success: true, events: evnts});
	});
});


module.exports = router;

