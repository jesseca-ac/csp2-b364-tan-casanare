const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: [true, 'User ID is required']
	},
	cartItems: [
		{
			productId: {
				type: String,
				required: [true, 'Product ID is Required']
			},
			productName: {
				type: String,
				required: [true, 'Product Name is Required']
			},
			productDescription: {
				type: String,
				required: [true, 'Product Description is Required']
			},
			quantity: {
				type: Number,
				required: [true, 'Quantity is Required']
			},
			subtotal: {
				type: Number,
				required: [true, 'Subtotal is Required'],
			}
		}
	],
	totalPrice: {
		type: Number,
		required: [true, 'Total Price is Required'],
		default: 0
	},
	orderedOn: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Cart', cartSchema);