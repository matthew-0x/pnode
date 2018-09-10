const mongoose = require('mongoose');

const schema = mongoose.Schema({
    quantity: {type: Number, default: 1},
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
})

module.exports = mongoose.model('Order', schema);