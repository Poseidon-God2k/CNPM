var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    items: {type: Array , required: true},
    userId: {type: String},
    totalQty:{type: Number, required: true},
    totalPrice:{type: Number, required: true},
});
module.exports = mongoose.model('Cart_db',schema);