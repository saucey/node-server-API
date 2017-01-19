'use strict';
var Users = require('../models/user.model');
var AdminUsers = require('../models/social.model');

var express = require('express');
var router = express.Router();
var _ = require('lodash');

router.route('/admin-social/:id').get(function(req, res, next) {
	AdminUsers.find(function(err, social) {
		return res.status(200).json({social: social});
	});
});

router.route('/social/:id').get(function(req, res, next) {
	Users.findById(req.params.id, function (err, user) {
		res.status(200).json({success: true, message: 'User retrieved', social: user.social});
	});
});

router.route('/social/:id').post(function(req, res, next) {
	Users.findOneAndUpdate({_id: req.params.id}, {social:req.body.social}, {upsert: true, "new": false}, function(err, doc){
		res.status(200).json({success: true, message: 'Your social networks have been updated', social: doc.social});
	});
});

router.route('/admin-social/:id').post(function(req, res, next) {
	_.forEach(req.body.social, function(value) {
		AdminUsers.remove({ name: value.name }, function(err, doc){
			var Model = new AdminUsers({name: value.name, url: value.url});
			Model.save(function(err, social){
			});
		});
	});
	res.status(200).json({success: true, message: 'Your social networks have been updated'});
});


module.exports = router;