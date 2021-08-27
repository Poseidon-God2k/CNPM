var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var session = require('express-session')
var expressHsb = require('express-handlebars');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator')
var MongoStore = require('connect-mongo')(session);
var bodyParser =require('body-parser')
var cors = require('cors')



var stripe =require('stripe')('sk_test_51GzJlmKPv17GXAC07gelBoXQEkIBm9iENHxSHHRc2rAHRsc9rGjm2ku4VF8vR2dSN7Kk3a3q53Zy6oLbGfeKFMgU00h0GPIChL')
var app = express();

app.use(cors())
var routes = require('./routes/index');
var userRoutes = require('./routes/user');

mongoose.connect('mongodb://mongo:27017/shopping', {useNewUrlParser: true, useUnifiedTopology: true});
require('./config/passport')

var hbs = expressHsb.create({});

hbs.handlebars.registerHelper('fourIf', function(conditional, options) {
  if((conditional % 4) == 0 && conditional != 0) {
   return options.fn(this);
  } else {
   return options.inverse(this);
  } 
 });


// view engine setup
app.engine('.hbs', expressHsb({defaultLayout: 'layout', extname:'.hbs'}));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(
  {secret:'mysupersecret',
  resave: false, 
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection}),
  cookie:{
    maxAge: 180 * 60 *1000,
    secure: false
  }
}))



app.use(flash());
app.use(validator());
app.use(passport.initialize());
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + './../public/js'));

app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  if(req.session.passport){
    if(req.session.passport.user){
      res.locals.vendor = req.session.passport.user.type == "vendor"? true:false;
    }
  }
  next();
});

//express fileupload middleare
// app.use(fileUpload());

//set global errors variable

app.locals.errors =null;



var routes = require('./routes/index');
var userRoutes = require('./routes/user');
var paymentRoutes = require('./routes/payment');
var vendorRoutes = require('./routes/vendor');

app.use('/vendor', vendorRoutes);
app.use('/payment', paymentRoutes);
app.use('/user', userRoutes);
app.use('/', routes);


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

module.exports = app;
