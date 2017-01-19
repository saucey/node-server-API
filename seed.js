var seeder = require('mongoose-seed');
var data = require('./seeders/user.seeder');
// var Users = require('./models/user.model');
var path = require('path');
var root = path.join(__dirname, '../');

var serverRoot = root + 'server/';

var dbName = 'zbtmi';
var connectionString = 'mongodb://localhost:27017/' + dbName;

seeder.connect(connectionString, function() {
	// Load Mongoose models
	seeder.loadModels([
		serverRoot + 'models/user.model.js',
	]);

	seeder.clearModels(['Users'], function() {
		seeder.populateModels(data);
	});
});