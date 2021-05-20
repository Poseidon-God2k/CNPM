var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var CartDb = require('../models/cart_db');
var Cart = require('../models/cart');
var csrf = require('csurf');
const passport = require('passport');
const { route } = require('./user');
const { find, db } = require('../models/cart_db');

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
    // var productChunks = [];
    var chunkSize = 16;
    var pageSize = Math.ceil(docs.length/16) - pageId;
    var rangePage = pageSize >5? 5 : pageSize;
    var listpage = range(pageId, pageId+rangePage)
    productChunks= (docs.splice(pageId*16 ,chunkSize));

    for(var i =0 ; i< productChunks.length ; i++){
      productChunks[i].price = numberWithDots(productChunks[i].price)
    }
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
    doc.price = numberWithDots(doc.price)
    res.render('shop/testProductDetails',{data:doc, imgOver: imgOver, listStar:listRate })
  }).lean();
})



router.get('/add-to-cart' , function(req, res, next){
  var productItem = req.query;
  var productId = productItem.id;
  var productQuantity = parseInt(productItem.quantity);
  var productVariaty = productItem.variation;
 
  if(req.session.passport && !req.session.cart){
    CartDb.findOne({"userId":req.session.passport.user, "checkPayment": false}, function(err, cartOfUser){
      if(err) console.log(err)
      if(cartOfUser){
      var cart = new Cart(cartOfUser.listCart)
      Product.findById(productId, async function(err, product){
        if(err)
          console.log(err);
        cart.add(product, productId, productQuantity, productVariaty);
        CartDb.findOneAndUpdate({"userId":req.session.passport.user, "checkPayment": false}, {listCart: cart},{new: true}, function(err, docs){
          if(err) console.log(err)
          res.send(JSON.stringify({"msg":"Thêm vào giỏ hàng thành công"}));
        })
      });
      }
      else{
        var cartDb = new Cart(req.session.cart ? req.session.cart:{items:{}});
        Product.findById(productId, async function(err, product){
          if(err)
            console.log(err);
          cartDb.add(product, productId, productQuantity, productVariaty);
          var cart = new CartDb({
            userId: req.session.passport.user,
            listCart: cartDb,
            checkPayment: req.session.checkPayment || false,
            transId: req.session.transId || "-1"
          })
          cart.save(function(err, result){
            if(err) throw err;
            else 
              console.log(result);
          })
          res.send(JSON.stringify({"msg":"Thêm vào giỏ hàng thành công"}));
      });
      }
    })
  }
  else{
    var cart = new Cart(req.session.cart ? req.session.cart:{items:{}});
    Product.findById(productId, async function(err, product){
      if(err)
        console.log(err);
      cart.add(product, productId, productQuantity, productVariaty);
      req.session.cart  = cart;
      res.send(JSON.stringify({"msg":"Thêm vào giỏ hàng thành công"}));
  });
  }
})

router.get('/add/:id', function(req, res, next){
  var productId = req.params.id;
  var variaty = req.query.variaty;
  if(req.session.passport && !req.session.cart){
    CartDb.findOne({"userId":req.session.passport.user, "checkPayment": false}, function(err, cartOfUser){
      if(err) console.log(err)
      var cart = new Cart(cartOfUser.listCart)
      cart.increaseOne(productId, variaty);
      CartDb.findOneAndUpdate({"userId":req.session.passport.user, "checkPayment": false}, {listCart: cart},{new: true}, function(err, docs){
        if(err) console.log(err)
        console.log(docs)
        res.redirect('/shopping-cart');
      })
    })
    
  }
  else{
    var cart = new Cart(req.session.cart ? req.session.cart:{items:{}});
    cart.increaseOne(productId, variaty);
    req.session.cart =cart;
    res.redirect('/shopping-cart');
  }
  
});
router.get('/reduce/:id', function(req, res, next){
  var productId = req.params.id;
  var variaty = req.query.variaty;
  if(req.session.passport && !req.session.cart){
    CartDb.findOne({"userId":req.session.passport.user, "checkPayment": false}, function(err, cartOfUser){
      if(err) console.log(err)
      var cart = new Cart(cartOfUser.listCart)
      cart.reduceByOne(productId, variaty);
      CartDb.findOneAndUpdate({"userId":req.session.passport.user, "checkPayment": false}, {listCart: cart},{new: true}, function(err, docs){
        if(err) console.log(err)
        console.log(docs)
        res.redirect('/shopping-cart');
      })
    })
    
  }
  else{
    var cart = new Cart(req.session.cart ? req.session.cart:{items:{}});
    cart.reduceByOne(productId, variaty);
    req.session.cart =cart;
    res.redirect('/shopping-cart');
  }
});
router.get('/remove/:id', function(req, res, next){
  var productId = req.params.id;
  var variaty = req.query.variaty;
  if(req.session.passport && !req.session.cart){
    CartDb.findOne({"userId":req.session.passport.user, "checkPayment": false}, function(err, cartOfUser){
      if(err) console.log(err)
      var cart = new Cart(cartOfUser.listCart)
      cart.removeItem(productId, variaty);
      CartDb.findOneAndUpdate({"userId":req.session.passport.user, "checkPayment": false}, {listCart: cart},{new: true}, function(err, docs){
        if(err) console.log(err)
        console.log(docs)
        res.redirect('/shopping-cart');
      })
    })
    
  }
  else{
    var cart = new Cart(req.session.cart ? req.session.cart:{items:{}});
    cart.removeItem(productId, variaty);
    req.session.cart =cart;
    res.redirect('/shopping-cart');
  }
});
router.get('/shopping-cart', async function(req,res,next){

  if(req.session.passport && !req.session.cart){
    var dbCart = await (async () => {
      const cart = await CartDb.findOne({"userId":req.session.passport.user, "checkPayment": false}).lean().exec()
      return cart
    })();
    if(dbCart){
      req.session.cartId = dbCart._id
    } 
    
    var cart = new Cart(dbCart?dbCart.listCart: {items:{}})
    var cartId = dbCart? dbCart._id: "";
    totalPrice = 1.1*cart.totalPrice;
    totalPayment = Math.round(totalPrice)
    res.render('shop/shopping-cart',{products: cart.generateArray(), totalOrder: numberWithDots(cart.totalPrice) , vat: numberWithDots(0.1*cart.totalPrice), totalPrice: numberWithDots(Math.round(totalPrice)),cartId: cartId,totalPayment: totalPayment });
  }
  else{
    if(!req.session.cart){
      return res.render('shop/shopping-cart',{products:null});
    }
    var cart = new Cart(req.session.cart);
    totalPrice = 1.1*cart.totalPrice;
    res.render('shop/shopping-cart',{products: cart.generateArray(), totalOrder: numberWithDots(cart.totalPrice) , vat: numberWithDots(0.1*cart.totalPrice), totalPrice: numberWithDots(Math.round(totalPrice)) });
  }
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