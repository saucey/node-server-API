var Tracks = require('../models/tracks.model.js');
var express = require('express');
var multer = require('multer');
var upload = multer({dest: 'tracks/'});
var router = express.Router();
var fs = require('fs-extra');
var slug = require('slug');
var fileExtension = require('file-extension');
var glob = require("glob");

var appRootPath = require('app-root-path');

var st = require('../helpers/storage');
var storageOptions = st('./tracks');

var upload = multer({storage: storageOptions}).any();

router.route('/create-new-track').post(function(req, res) {
	upload(req, res, function(err) {
		var extension = '.'+fileExtension(req.files[0].originalname);
		var trackName = slug(req.files[0].originalname);

		if (err) return res.end("Error uploading file.");
		fs.move(appRootPath+'/server/tracks/' + req.files[0].filename, appRootPath+'/server/tracks/' + trackName + extension, function(err) {
			if (err) return console.error(err)

			var track = new Tracks({
				'name': trackName
			});

			track.save(function(err, theTrack) {
				if (err) {
					res.status(400).json({error: err, success: false});
				}
				res.status(200).json({success: true, message: 'Track has been successfully uploaded', track: theTrack});
			});
		})
	});
});

router.route('/tracks').get(function(req, res) {

	Tracks.find(function(err, tracks){
		if(err){
		}
		return res.status(200).json(tracks);
	});
});

router.route('/remove-track').post(function(req, res) {

	Tracks.remove({ name: req.body.track.name }, function(err, doc){
		glob(appRootPath+'/server/tracks/'+req.body.track.name + ".*", function (er, file) {
			fs.unlink(file[0],function(err){
				if(err) return res.status(400).json({fail: err});
			});
		});
		return res.status(200).json({success: true, message: 'Track has been successfully deleted'});
	});
});

module.exports = router;
