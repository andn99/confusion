import dishRouter from './routes/dishRouter';
import leaderRouter from './routes/leaderRouter';
import promoRouter from './routes/promoRouter';
import userRouter from './routes/users';
import uploadRouter from './routes/uploadRouter';
import mongoose from 'mongoose';
import passport from 'passport';
import authenticate from './authenticate';
import Config from './config';

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

var indexRouter = require('./routes/index');


var app = express();
app.all('*', (req, res, next) => {
  if(req.secure){
    next();
  }else{
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort'));
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);
app.use('/imageUpload', uploadRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Connect mongodb
mongoose.connect(Config.MONGODB_URL).then(db => {
  console.log('Connect mongodb successfully!');
}, err => {
  console.log('Fail to connect mongodb: ', err);
})

module.exports = app;
