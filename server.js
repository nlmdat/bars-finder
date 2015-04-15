var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require("passport");
var query = require("pg-query");
var expressSession = require("express-session");
var flash = require("connect-flash");
var bars = require("./bars/bars");

var port = 3000;

var app = express();

// PostgreSQL setup
if (process.env.DATABASE_URL) {
	query.connectionParameters = process.env.DATABASE_URL;
} else {
	query.connectionParameters = "postgres://cp3101b:cp3101b@localhost/barsfinder";
}

// Passport setup
app.use(expressSession({secret: "secret session"}));
app.use(passport.initialize());
app.use(passport.session());
require("./passport/passport")(passport, query, bars);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// Dynamic helpers
require("express-dynamic-helpers-patch")(app);
app.dynamicHelpers({
	user: function(req, res) {
		return req.user;
	}
});

// Routes setup
require('./routes/index')(app, query, passport, bars);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


console.log("Listening to port " + port);

module.exports = app;
app.listen(port);
