'use strict';
var Users = require('../models/user.model');
var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var fs = require('fs-extra');
var slug = require('slug');
var _ = require('lodash');
var saltRounds = 10;

var appRoot = require('app-root-path');
var uploadArtistFolder = appRoot + "/server/uploads/artists/";

router.route('/users').get(function(req, res) {

	Users.find(function(err, users) {

		_.remove(users, function(user) {
			return _.indexOf(['Admin'], user.roles.name) !== -1
		});

		return res.status(200).json(users);
	});

});

router.route('/user-activate').post(function(req, res) {
	Users.findByIdAndUpdate(req.body.user._id, {active: req.body.user.active}, function(err, raw) {
		if (!raw.active) {
			return res.status(200).json({success: true, message: 'User is now active'});
		} else {
			return res.status(200).json({success: true, message: 'User has been deactived'});
		}
	});
});

router.route('/user-remove').post(function(req, res) {

	var artistPath = appRoot + '/server/uploads/artists/' + req.body.user.upload_folder_name;

	Users.remove({_id: req.body.user._id}, function(err, doc) {

		var deleteFolderRecursive = function(artistPath) {
			if (fs.existsSync(artistPath)) {
				fs.readdirSync(artistPath).forEach(function(file, index) {
					var curPath = artistPath + "/" + file;
					if (fs.lstatSync(curPath).isDirectory()) { // recurse
						deleteFolderRecursive(curPath);
					} else { // delete file
						fs.unlinkSync(curPath);
					}
				});
				fs.rmdirSync(artistPath);
			}
		};

		deleteFolderRecursive(artistPath);

		return res.status(200).json({success: true, message: 'User has been successfully deleted'});
	});

});

router.route('/user-create').post(function(req, res) {

	//check if the user uploaded has the same username as any other users in the database
	var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(saltRounds));
	var folder_name = req.body.name.replace(/\s+/g, '');
	var bio_folder = folder_name + '/bio';
	var slugName = slug(req.body.name, {lowercase: true});

	//if user folder already exists dont create
	fs.mkdirs(uploadArtistFolder + folder_name, function(err) {
		if (err) return console.error(err)
	});

	var user = new Users({
		name: req.body.name,
		password: hash,
		upload_folder_name: folder_name,
		upload_bio_folder: bio_folder,
		slug: slugName,
		roles: {
			name: 'Artist'
		},
		modules: [{
			'name': 'admin.dashboard'
		}, {
			'name': 'admin.bio'
		}, {
			'name': 'admin.gallery'
		}, {
			'name': 'admin.events'
		}]
	});

	user.save(function(err, newUser) {
		if (err) {
			res.status(400).json({error: err, success: false});
		}
		res.status(200).json({success: true, message: 'User has been created', user: newUser});
	});
});

module.exports = router;

