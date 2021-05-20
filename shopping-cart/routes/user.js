var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var Cart = require('../models/cart_db');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true, useUnifiedTopology: true});
const passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile',isLoggedIn,function(req, res, next){
  res.render('user/profile');
});

router.get('/logout',isLoggedIn, function(req,res,next){
  //Store cart to cart before logout
  // console.log(typeof req.session.cart)
  if(req.session.cart){
    var cart = new Cart({
      userId: req.session.passport.user,
      listCart: req.session.cart,
      checkPayment: req.session.checkPayment || false,
      transId: req.session.transId || "-1"
    })
    cart.save(function(err, result){
      if(err) throw err;
      else 
        console.log(result);
    })
  }
  // session destroy when isLoggedIn false
  req.session.destroy();
  req.logout();
  res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next){
  next();
});


router.get('/signup',function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signup',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0});
});

router.post('/signup', passport.authenticate('local.signup',{
  successRedirect:'/user/profile',
  failureRedirect:'/user/signup',
  failureFlash:true
}));

router.get('/signin',function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signin',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0});
});

router.post('/signin', passport.authenticate('local.signin',{
  successRedirect:'/user/profile',
  failureRedirect:'/user/signin',
  failureFlash:true
}));

module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    //req.isAuthenticated() will return true if user is logged in
    next();
  } else{
    res.redirect("/");
  }
}

function notLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
    //req.isAuthenticated() will return true if user is logged in
    next();
  } else{
    res.redirect("/");
  }
}