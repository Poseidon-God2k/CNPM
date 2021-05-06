var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name:{ type:String},
    rate:{type: Number},
    vote:{type: Number},
    sold:{type:Number},
    price:{type: Number},
    listVar:{type: Array , required: true},
    listImg:{type: Array , required: true},
    quantity:{type: Number, required: true},
    description:{type: String},
});
module.exports = mongoose.model('Product',schema);
