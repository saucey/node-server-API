'use strict';
var Users = require('../models/user.model');
var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var multer = require('multer');
var _ = require('lodash');

var st = require('../helpers/storage');
var storageOptions = st('./uploads');
var lwip = require('lwip');
var upload = multer({storage: storageOptions}).any();

var appRoot = require('app-root-path');

router.route('/getbio').get(function(req, res) {

	Users.find({'roles.name': 'Artist', 'active': true}, function(err, artists) {
		if (err) return console.error(err);
		return res.status(200).json(artists);
	});

});

router.route('/bio-get-single').post(function(req, res, next) {

	Users.findOne({slug: req.body.slug}, function(err, user) {
		return res.json(user);
	});

});

router.route('/bio-save').post(function(req, res, next) {
	var uploadPath = appRoot + "/server/uploads/artists/";

	upload(req, res, function(err) {
		if (err) return res.end("Error uploading file.");

		var newdata = {
			genres: req.body.genres,
			country: req.body.countrylocation,
			city: req.body.citylocation,
			iso_code: req.body.iso_code,
			label: req.body.label,
			intro: req.body.intro,
			content: req.body.content,
			featured_video: req.body.featured_video,
			artist_name: req.body.artist,
			slug: req.body.slug
		};

		if (err) return res.end("Error uploading file.");

		try {
			// Query the entry
			var stats = fs.lstatSync(uploadPath + req.body.bio_folder_path);
			var files = fs.readdirSync(uploadPath + req.body.bio_folder_path);

			if (!_.isEmpty(req.files)) {
				if (stats.isDirectory()) {
					if (files.length > 0) {
						for (var i = 0; i < files.length; i++) {
							var filePath = uploadPath + req.body.bio_folder_path + '/' + files[i];
							if (fs.statSync(filePath).isFile()) {
								fs.unlinkSync(filePath);
							}
						}
					}
				}
			}
		}

		catch (e) {
			console.log(e, 'is error - no dir');
		}

		if (!_.isEmpty(req.files)) {
			//if file is uploaded
			newdata.img = req.body.bio_folder_path + '/' + req.files[0].originalname;

			fs.move('./uploads/' + req.files[0].filename, uploadPath + newdata.img, function(err) {
				if (err) return console.error(err)

				// obtain an image object:
				lwip.open(uploadPath + newdata.img, function(err, image) {
					var width = 540;
					var height = 660;

					var widthRatio = width / image.width();
					var heightRatio = height / image.height();
					var ratio = Math.max(widthRatio, heightRatio);

					image.batch()
						.scale(ratio)
						.crop(width, height)
						.writeFile(uploadPath + newdata.img, function(err) {
					});
				});
			});
		} else {

			//if is'nt upload file that is already there
			var file = fs.readdirSync(uploadPath + req.body.bio_folder_path);

			if (!_.isEmpty(file)) {
				newdata.img = req.body.bio_folder_path + '/' + file[0];
			}

		}

		Users.findByIdAndUpdate(req.body.id, {bio: newdata}, function(err, raw) {
			return res.status(200).json({success: true, 'bio': raw, message: 'Bio has been successfully edited'});
		});

	});
});


router.route('/bio').post(function(req, res, next) {

	Users.findOne({_id: req.body.userId}, function(err, doc) {
		var bio = doc.bio;
		return res.status(200).json({success: true, 'bio': bio});
	});

});


module.exports = router;