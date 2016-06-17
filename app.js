var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var flash = require('connect-flash');
var passport = require("passport");
var authentication = require("./authentication");

var socket_io    = require( "socket.io" );

var routes = require('./routes/index');
var public = require('./routes/public');
var admin = require('./routes/admin');
var api = require('./routes/api');

var app = express();

// CONFIG
var config = require("./config");
app.locals.title   = config.title;
//app.locals.cameras = config.cameras;

// SOCKETIO
var io = socket_io();
app.io = io;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash()); // For flash messages stored in session. TODO: consider move to relevant route.
app.use(session({ secret: 'roedgroedmedfloede', saveUninitialized: true, resave: true})); // Session secret, required for passport
app.use(passport.initialize());
app.use(passport.session());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
   if(req.url.substr(-1) == '/' && req.url.length > 1)
       res.redirect(301, req.url.slice(0, -1));
   else
       next();
});

app.use('/api', api);
app.use('/admin', admin);
app.use('/', public);
app.use('/', routes);

// SOCKET.IO
const rootController = require('./sockets/rootController')(io);
const cameraController = require('./sockets/cameraController')(io);
const camerasController = require('./sockets/camerasController')(io);


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
  app.locals.pretty = true;
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


module.exports = app;
