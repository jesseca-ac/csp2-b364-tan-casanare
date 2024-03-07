const Order = require("../models/Order");
const Cart = require("../models/Cart");



module.exports.getOrders = (req, res) => {

    if(req.user.isAdmin) {
        return res.status(403).send({ message: "Admins are forbidden to have an order." });
    }

    Order.find({ userId: req.user.id })
    .then(foundOrder => {
        if(!foundOrder) {
            return res.status(404).send({ message: "Order not found." });
        }

        return res.status(200).send({
            message: "User's order found.",
            orders: foundOrder
        });
    })
    .catch(findErr => {
        console.error("Error in finding order: ", findErr);
        return res.status(500).send({ error: "Failed in finding order." });
    })

};


module.exports.createOrder = (req, res) => {
    
    if(req.user.isAdmin) {
        return res.status(403).send({ message: "Admins are forbidden to checkout." });
    }

    Cart.findOneAndUpdate({ userId: req.user.id }, {
        cartItems: [],
        totalPrice: 0
    })
    .then(foundCart => {
        if(!foundCart) {
            return res.status(404).send({ message: "Cart not found." });
        }

        if(foundCart.cartItems.length == 0) {
            return res.status(404).send({ message: "User's cart is empty." });
        }

        let newOrder = new Order({
            userId: req.user.id,
            productsOrdered: foundCart.cartItems,
            totalPrice: foundCart.totalPrice
        });

        return newOrder.save()
        .then(checkedOut => {
            return res.status(201).send({
                message: "Cart successfully checked out.",
                order: checkedOut
            });
        })
        .catch(savErr => {
            console.error("Error in saving new order: ", savErr);
            return res.status(500).send({ error: "Failed to save new order." });
        })
    })
};


module.exports.getAllOrders = (req, res) => {

    if(!req.user.isAdmin) {
        return res.status(403).send({ message: "Non-admin accounts are not allowed to access this method." });
    }

    Order.find({})
    .then(foundOrder => {
        if(!foundOrder) {
            return res.status(404).send({ message: "No orders exist yet." });
        }

        return res.status(200).send({
            message: "All orders retrievevd successfully.",
            allOrders: foundOrder
        });
    })
    .catch(findErr => {
        console.error("Error finding all orders: ", findErr);
        return res.status(500).send({ error: "Failed to find all orders." });
    })
}

