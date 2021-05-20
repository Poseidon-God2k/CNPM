var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartSchema = new Schema({
    userId:{
        type:String,
        required: true
    },
    listCart:{
        type: Object,
        require: true
    },
    checkPayment:{
        type:Boolean,
        required: true
    },
    transId:{
        type:String,
        required: true
    },
});
module.exports = mongoose.model('Cart',cartSchema);