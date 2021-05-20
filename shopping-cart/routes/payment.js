var express = require('express');
var router = express.Router();
var CartDb = require('../models/cart_db');
var Cart = require('../models/cart');
const { v1: uuidv1 } = require('uuid');
const https = require('https');

router.get("/:id", function(req,res, next){
    var orderId = req.params.id
    var totalPayment = req.query.totalPayment
    var partnerCode = "MOMODX6820210518"
    var accessKey = "WIUJhj56YFf8zqmS"
    var serectkey = "fD3qtZG3B9ODsFgg3wezAytIZgmNZAQ1"
    var orderInfo = "Pay order with MoMo"
    var returnUrl = "http://localhost:3000/payment"
    var notifyurl = "http://localhost:3000/notify"
    var amount = totalPayment
    var orderId = orderId +uuidv1()
    var requestId = uuidv1()
    var requestType = "captureMoMoWallet"
    var extraData = "merchantName=;merchantId="

    var rawSignature = "partnerCode="+partnerCode+"&accessKey="+accessKey+"&requestId="+requestId+"&amount="+amount+"&orderId="+orderId+"&orderInfo="+orderInfo+"&returnUrl="+returnUrl+"&notifyUrl="+notifyurl+"&extraData="+extraData
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', serectkey)
                    .update(rawSignature)
                    .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)

    var body = JSON.stringify({
        partnerCode : partnerCode,
        accessKey : accessKey,
        requestId : requestId,
        amount : amount,
        orderId : orderId,
        orderInfo : orderInfo,
        returnUrl : returnUrl,
        notifyUrl : notifyurl,
        extraData : extraData,
        requestType : requestType,
        signature : signature,
    })

    var options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/gw_payment/transactionProcessor',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
       }
    };


    console.log("Sending....")
    var reqPayment = https.request(options, (resPayment) => {
        console.log(`Status: ${resPayment.statusCode}`);
        console.log(`Headers: ${JSON.stringify(resPayment.headers)}`);
        resPayment.setEncoding('utf8');
        resPayment.on('data', (body) => {
          console.log('Body');
          console.log(body);
          console.log('payURL');
          res.redirect(JSON.parse(body).payUrl);
        });
      
        resPayment.on('end', () => {
          console.log('No more data in response.');
        });
    });

    reqPayment.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });
      
    // write data to request body
    reqPayment.write(body);
    reqPayment.end();
    if(req.query.message){
        console.log(req.query.message)
    }




})

router.get('/', function(req, res, next){
    if(req.query.message == "Success"){
        var transId = req.query.transId
        var update = {
            checkPayment: true,
            transId:transId
        }
        CartDb.findOneAndUpdate({"_id":req.session.cartId, "checkPayment": false},update, {new: true}, function(err, docs){
            if(err) throw err
            res.redirect("/shopping-cart")
        })
    }
    else{
        console.log("ERROR")
    }
})

module.exports = router ;
