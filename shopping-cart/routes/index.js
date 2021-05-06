var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var csrf = require('csurf');
const passport = require('passport');
const { route } = require('./user');

/* GET home page. */
router.get('/', function(req, res, next) {
  var pageId = req.params.page || 0;
  res.redirect('/products/0')
});

router.get('/products/:page', async function(req, res, next){
  var pageId = parseInt(req.params.page) || 0;
  var textSearch = req.query.textSearch || "";
  var optionSort = req.query.sort =="default"? "": req.query.sort;
  var filter={"name": { $regex: '.*' + textSearch + '.*' }};
  var sorted = {sort: {price: optionSort}};
  if(!textSearch){
    filter ={}
  }
  if(!optionSort){
    sorted = null
  }

  Product.find(filter,null, sorted,function(err, docs){
    var productChunks = [];
    var chunkSize = 16;
    var pageSize = Math.ceil(docs.length/16) - pageId;
    var rangePage = pageSize >5? 5 : pageSize;
    var listpage = range(pageId, pageId+rangePage)
    productChunks.push(docs.splice(pageId*16 ,chunkSize));
    res.render('shop/index', { title: 'Shopping Cart' , products : productChunks, page: listpage,text: textSearch , option: optionSort});
  }).lean();

});

router.get('/product-details/:id' , function(req, res, next){
  var productId = req.params.id;
  Product.findById(productId,function(err, doc){
    if(err)
      throw err;
    var imgOver = doc.listImg[0].slice(0,-3);
    var listRate = listStar(parseFloat(doc.rate))
    res.render('shop/testProductDetails',{data:doc, imgOver: imgOver, listStar:listRate})
  }).lean();
})



router.get('/add-to-cart' , function(req, res, next){
  var productItem = req.query;
  var productId = productItem.id;
  var productQuantity = parseInt(productItem.quantity);
  var productVariaty = productItem.variation;
  var cart = new Cart(req.session.cart ? req.session.cart:{items:{}});

  Product.findById(productId, async function(err, product){
      if(err)
        console.log(err);
      cart.add(product, productId, productQuantity, productVariaty);
      req.session.cart  = cart;
      res.header('Access-Control-Allow-Credentials', 'true');
      res.send(JSON.stringify({"msg":"Thêm vào giỏ hàng thành công"}));
      res.redirect("/add-to-cart")
  });
})

router.get('/add/:id', function(req, res, next){
  var productId = req.params.id;
  var variaty = req.query.variaty;
  var cart = new Cart(req.session.cart ? req.session.cart:{items:{}});
  cart.increaseOne(productId, variaty);
  req.session.cart =cart;
  res.redirect('/shopping-cart');
});
router.get('/reduce/:id', function(req, res, next){
  var productId = req.params.id;
  var variaty = req.query.variaty;
  var cart = new Cart(req.session.cart ? req.session.cart:{items:{}});
  cart.reduceByOne(productId, variaty);
  req.session.cart =cart;
  res.redirect('/shopping-cart');
});
router.get('/remove/:id', function(req, res, next){
  var productId = req.params.id;
  var variaty = req.query.variaty;
  var cart = new Cart(req.session.cart ? req.session.cart:{items:{}});
  cart.removeItem(productId, variaty);
  req.session.cart =cart;
  res.redirect('/shopping-cart');
});
router.get('/shopping-cart',function(req,res,next){
  console.log(req.session.cart)
  if(!req.session.cart){
    return res.render('shop/shopping-cart',{products:null});
  }
  var cart = new Cart(req.session.cart);
  console.log(cart.generateArray());
  res.render('shop/shopping-cart',{products: cart.generateArray(), totalOrder: cart.totalPrice , vat: 0.1*cart.totalPrice, totalPrice: 0.9*cart.totalPrice });
});

router.get('/checkout',function(req,res,next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/checkout',{total: cart.totalPrice});
});

router.get('/search/',function(req,res,next){
  var textSearch = req.query.textSearch;
  var pageId = req.params.page || 0;

  Product.find({ "name": { $regex: '.*' + textSearch + '.*' } }, function(err, docs){
    var productChunks = [];
    var chunkSize = 16;
    console.log(docs.length)
    var pageSize = Math.ceil(docs.length/16);
    var rangePage = pageSize >5? 5 : pageSize;
    var listpage = range(0, rangePage)
    productChunks.push(docs.splice(pageId*16 , chunkSize));
    res.render('shop/index', { title: 'Shopping Cart' , products : productChunks, page: listpage});
  }).lean();
});


module.exports = router;

//function more include
function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

function listStar(number) {
  var arr = [];
  while(number > 1){
    arr.push(100)
    number--;
  }
  arr.push(number*100);
  return arr;
}

function convertInt_VND( price){
  return parseInt(price.replaceAll('.',''), 10)
}

function numberWithDots(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}