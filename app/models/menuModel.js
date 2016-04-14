var mongoose = require('mongoose');

module.exports = mongoose.model('menu', {
    name : String,
    price: Number
});