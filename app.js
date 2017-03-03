
var mongoose = require('mongoose');
require('./models/portfolio');
require('./models/user');

mongoose.connect('mongodb://localhost/guc');

var express = require('express');
var path = require('path');
var flash=require("connect-flash");

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();



var session = require('express-session');
app.use(session({
	secret:'secret',
	saveUninitialized:true,
	resave:true

}));

app.use(flash());

app.use(function(req,res,next){
	res.locals.req=req;
	res.locals.res = res;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	res.locals.warning = req.flash('warning');
	next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
var index = require('./routes/index');
var users = require('./routes/users');
app.use('/', index);
app.use('/users', users);

module.exports = app;
app.listen(3000);
console.log('Server up!')