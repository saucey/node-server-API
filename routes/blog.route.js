'use strict';
var Blog = require('../models/blog.model');
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

router.route('/blog').get(function(req, res) {
	Blog.find(function(err, blog) {
		return res.status(200).json(blog);
	});
});

router.route('/blog-save').post(function(req, res, next) {

	var uploadPath = appRoot + "/server/uploads/blog/";

	upload(req, res, function(err) {

	var savs = req.body;

		if (err) return res.end("Error uploading file.");

		if (!_.isEmpty(req.files)) {

			//check if the id has a image already then remove the file
			if(req.body.id !== undefined) {
				Blog.findById(req.body.id, function (err, blog) {
					var file = uploadPath + blog.featured_image;
					fs.unlinkSync(file);
				});
			}

			var blogImg = Number(new Date()) + req.files[0].originalname;
			//save image and rename with time date method extension

			savs.featured_image = blogImg;

			var newBlogImg = uploadPath + '/' + blogImg;

			fs.move('./uploads/' + req.files[0].filename, newBlogImg, function(err) {
				if (err) return console.error(err)

				// obtain an image object:
				lwip.open(newBlogImg, function(err, image) {

					var width = 800;
					var height = 600;

					var widthRatio = width / image.width();
					var heightRatio = height / image.height();
					var ratio = Math.max(widthRatio, heightRatio);

					image.batch()
						.scale(ratio)
						.crop(width, height)
						.writeFile(newBlogImg, function(err) {
					});
				});
			});
		}

		if(req.body.id !== undefined) {
			//Update
			Blog.findOneAndUpdate({_id: req.body.id}, savs, {upsert: true, "new": false}, function(err, doc){
				res.status(200).json({success: true, message: 'Your blog post has been updated', blog: doc.blog});
			});
		} else {
			//Create New
			Blog(savs).save(function(err, blog){
				if (err) return res.status(400).json({success: false, message: 'Your blog post was unable to be saved'});
				console.log('new blog saved');
				res.status(200).json({success: true, message: 'Your blog post was succesfully saved'});
			});
		}

	});
});

router.route('/blog/:id').get(function(req, res, next) {
	Blog.findById(req.params.id, function (err, blog) {
		res.status(200).json({success: true, message: 'Blog retrieved', blog: blog});
	});
});

router.route('/blog/:id').delete(function(req, res, next) {
	Blog.remove({_id: req.params.id}, function(err, doc) {
		return res.status(200).json({success: true, message: 'Blog has been successfully deleted'});
	});
});

module.exports = router;
