'use strict';
var Users = require('../models/user.model');
var express = require('express');
var router = express.Router();


router.route('/artist/:id').get(function(req, res, next) {
	Users.findById(req.params.id, function (err, user) {
		res.status(200).json({success: true, message: 'User retrieved', user: user});
	});
});

module.exports = router;