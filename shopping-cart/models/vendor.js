var mongoose = require('mongoose');
var Schema = mongoose.Schema;
Schema = mongoose.Schema;

var vendorSchema = new Schema({
    userId:{type:String, required},
    listItemId:{type:Array, required},
    rate : {type: Number},
    liked: { type: Number},
    repsoneRate:{type: Number}
})

module.exports = mongoose.model('vendor', vendorSchema);