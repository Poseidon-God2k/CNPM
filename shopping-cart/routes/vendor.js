var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.render('vendor/home',{vendorPage:true});
});

router.get('/home', function(req, res, next){
    res.render('vendor/home',{vendorPage:true});
});

router.get('/message', function(req, res, next){
    res.render('vendor/message',{vendorPage:true});
});

router.get('/product', function(req, res, next){
    res.render('vendor/product',{vendorPage:true});
});
module.exports = router;