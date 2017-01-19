var Users = require('../models/user.model');
var express = require('express');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var router = express.Router();
var fs = require('fs-extra');
var lwip = require('lwip');
var appRootPath = require('app-root-path');
var _ = require('lodash');

var st = require('../helpers/storage');
var storageOptions = st('./uploads');

var upload = multer({storage: storageOptions}).any();

router.route('/user-gallery').post(function(req, res) {
	upload(req, res, function(err) {
		if (err) return res.end("Error uploading file.");
		var imagePath = req.body.user_path + '/' + Number(new Date()) + req.files[0].originalname;
		var newGalleryImg = appRootPath + '/server/uploads/artists/' + imagePath;

		fs.move('./uploads/' + req.files[0].filename, newGalleryImg, function(err) {
			if (err) return res.status(400).json({
				success: true,
				message: 'We encounted a problem - Image may already exist'
			});

			lwip.open(newGalleryImg, function(err, image) {
				var width = 570;
				var height = 570;

				var widthRatio = width / image.width();
				var heightRatio = height / image.height();
				var ratio = Math.max(widthRatio, heightRatio);

				image.batch()
					.scale(ratio)
					.crop(width, height)
					.writeFile(newGalleryImg, function(err) {
					});
			});

			Users.findOne({_id: req.body.id}, function(err, doc) {
				var uploadImg = {img: imagePath};
				doc.gallery.push(uploadImg);

				doc.save(function(err, theImg) {
					var savedImg = _.find(theImg.gallery, function(o) {
						return o.img == uploadImg.img;
					});
					return res.status(200).json({
						success: true,
						message: 'image successfully uploaded',
						userImg: savedImg
					});
				});
			});
		})
	});
});

router.route('/user-gallery-delete-img').post(function(req, res) {

	Users.findOne({_id: req.body.id.uid}, function(err, doc) {
		doc.gallery.pull({_id: req.body.id.iid})
		doc.save();
	});

	fs.unlink(appRootPath + '/server/uploads/artists/' + req.body.id.ipath, function(err) {
		if (err) return res.status(400).json({fail: err});
		return res.status(200).json({success: true, message: 'file deleted successfully'});
	});
});

module.exports = router;
