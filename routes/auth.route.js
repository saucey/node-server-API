'use strict';
var Users = require('../models/user.model');
var express = require('express');
var jwt = require('jwt-simple');
var router = express.Router();


// const myPlaintextPassword = 'click123';
// const someOtherPlaintextPassword = 'not_bacon';

router.route('/auth').post(function(req, res, next) {

	var userId =  jwt.decode(req.body.token, 'hello');

	Users.findOne({ _id: userId }, function (err, user) {

		return res.json({user: user});
		
	});
	
});



module.exports = router;

