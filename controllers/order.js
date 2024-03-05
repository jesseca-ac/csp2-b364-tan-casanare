const Order = require("../models/Order");
const Cart = require("../models/Cart");


module.exports.createOrder = (req, res) => {

    Order.find({ userId: req.user.id, status: "Pending" })
        .then(pendingOrders => {
            if (pendingOrders.length > 0) {
                return res.status(200).send({ pendingOrder })
            }

            else {
                Cart.findOne({ userId: req.user.id })
                    .then(foundCart => {
                        if (!foundCart) {
                            return res.status(404).send({ message: "Cant checkout - Cart Not Found." });
                        }

                        else {
                            let newOrder = new Order({
                                userId: req.user.id,
                                orderItems: req.body.cartItems
                            })

                            newOrder.save()
                                .then(savedOrder => {
                                    return res.status(200).send({
                                        message: "Order successfully created",
                                        newOrder: savedOrder
                                    });
                                })
                                .catch(error => {
                                    return res.status(500).send({ error: `Can't checkout - Error in saving order: ${error}` });
                                });
                        }
                    })
                    .catch(err => {
                        return res.send(500).send({ error: `Cant checkout - Error in finding cart: ${err}` });
                    });

            }
        })

        .catch(err => {
            return res.send(500).send({ error: `Error in retrieving Pending Orders: ${err}` });
        });

}


module.exports.getOrder = (req, res) => {


}


module.exports.allOrders = (req, res) => {

}

