const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  pictures: [{ type: String }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // make a relation with user collection
});

module.exports = mongoose.model('Product', ProductSchema);
