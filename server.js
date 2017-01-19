var express = require('express');
var multer  = require('multer');

// var upload = multer({ dest: './uploads/' });
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();

var root = path.join(__dirname, '../');

var users = require('./routes/user.route'); //routes are defined here
var locations = require('./routes/locations.route'); //routes are defined here
var events = require('./routes/events.route'); //routes are defined here
var login = require('./routes/login.route'); //routes are defined here
var auth = require('./routes/auth.route'); //routes are defined here
var bio = require('./routes/bio.route'); //routes are defined here
var blog = require('./routes/blog.route'); //routes are defined here
var social = require('./routes/social.route'); //routes are defined here
var gallery = require('./routes/gallery.route'); //routes are defined here
var tracks = require('./routes/tracks.route'); //routes are defined here
var artist = require('./routes/artist.route'); //routes are defined here
var mongoose = require('mongoose');

var dbName = 'zbtmi';
var connectionString = 'mongodb://localhost:27017/' + dbName;

mongoose.connect(connectionString);

var passport = require('passport');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, token, Content-Type, Accept");
	next();
});

// Backend serving
app.use('/bower_components',  express.static(root + 'bower_components'));
app.use('/server',  express.static(root + 'server'));
app.use('/images',  express.static(root + 'images'));
app.use('/app_backend.js',  express.static(root + 'app_backend.js'));
app.use('/app_backend.css',  express.static(root + 'app_backend.css'));
app.use('/app_backend',  express.static(root + 'app_backend'));

// Frontend serving
app.use('/assets',  express.static(root + 'assets'));
app.use('/css',  express.static(root + 'css'));
app.use('/rs-plugin',  express.static(root + 'rs-plugin'));
app.use('/app.less',  express.static(root + 'app.less'));
app.use('/app',  express.static(root + 'app'));
app.use('/app.js', express.static(root + 'app.js'));

// app.get("/admin/*",function(req,res){
// 	res.sendFile(root + 'backend.html');
// });

app.get('/admin', function(req, res) {
	res.sendFile(root + 'backend.html');
});

app.get('/', function(req, res) {
	res.sendFile(root + 'index.html');
});

app.get('/wayne', function(req, res) {
	res.sendFile(root + 'wayneworld.html');
});


app.use('/api', users); //This is our route middleware
app.use('/api', login); //This is our route middleware
app.use('/api', events); //This is our route middleware
app.use('/api', locations); //This is our route middleware
app.use('/api', auth); //This is our route middleware
app.use('/api', bio); //This is our route middleware
app.use('/api', social); //This is our route middleware
app.use('/api', gallery); //This is our route middleware
app.use('/api', tracks); //This is our route middleware
app.use('/api', artist); //This is our route middleware
app.use('/api', blog); //This is our route middleware

passport.serializeUser(function(user, done) {
	console.log('we get here!!!');
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

app.listen(3000);

