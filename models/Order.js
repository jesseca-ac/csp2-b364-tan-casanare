const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Order must be associated with a User"]
    },
    productsOrdered: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "ProductId is required"]
        },
        productName: {
            type: String,
            required: [true, 'Product Name is Required']
        },
        productDescription: {
            type: String,
            required: [true, 'Product Description is Required']
        },
        productPrice: {
            type: Number,
            required: [true, 'Product Price is Required'],
        },
        quantity: {
            type: Number,
            default: 0
        },
        subtotal: {
            type: Number,
            default: 0
        }
    }],
    totalPrice: {
        type: Number,
        default: 0
    },
    orderedOn: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "Pending"
    }
});

module.exports = mongoose.model("Order", orderSchema);
