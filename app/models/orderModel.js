var mongoose = require('mongoose');

module.exports = mongoose.model('food', {
    name : String,
    price: Number
});