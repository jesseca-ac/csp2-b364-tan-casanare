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
