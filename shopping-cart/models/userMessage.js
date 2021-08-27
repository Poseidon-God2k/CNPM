var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userMessage = new Schema({
    roomId:{type:String, required},
    userId:{type:String, required},
    messages:{type:Array, required}
})

// var message = new Schema({
//     content: {String, required},
//     time: {Number, required},
//     userRead:{Boolean, required}
// })

module.exports = mongoose.model('userMessage',userMessage)