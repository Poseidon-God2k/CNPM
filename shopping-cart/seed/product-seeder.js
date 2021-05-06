var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping', {useNewUrlParser: true, useUnifiedTopology: true});
const fs = require("fs")

var productsParse;

fs.readFile('./data.json', 'utf8', (err, data) => {

    if (err) {
        console.log(`Error reading file from disk: ${err}`);
    } else {

        // parse JSON string to JSON object
        const databases = JSON.parse(data);
        //parse price to int(NOT DONEs)
        
        console.log(databases.length)
        // print all databases
        var count =0;
        databases.forEach(db => {
            var price = parseInt(db.price);
            var product = new Product({
                name: db.name.split("]")[1],
                rate: db.rate,
                vote: db.vote,
                sold: db.sold,
                price: price,
                listVar: db.listVar,
                listImg: db.listImgs,
                quantity: db.quantity,
                description: db.description
            })
            product.save(function(err,result){
                if(err) throw err;
                else 
                return result;
            })
            
        });
        // exit();
        return 0;
    }

});



function exit(){
    mongoose.disconnect();
}
