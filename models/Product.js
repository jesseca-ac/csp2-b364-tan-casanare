const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Product Name is Required']
	},
	description: {
		type: String,
		required: [true, 'Description is Required']
	},
	price: {
		type: Number,
		required: [true,  'Price is Required']
	},
	isActive: {
		type: Boolean,
		default: true
	},
	imgLink: {
		type: String,
		default: "https://scontent.fcrk2-2.fna.fbcdn.net/v/t39.30808-6/430978517_731226259098277_3209205290415278606_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=pdBNi5K_ZikAb6jzVD8&_nc_ht=scontent.fcrk2-2.fna&oh=00_AfCyxUGnT1awgJ7fj4Ir_1-U6MmwUZYeYmtNbG69csjOdw&oe=6618867D"
	},
	createdOn: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Product', productSchema);