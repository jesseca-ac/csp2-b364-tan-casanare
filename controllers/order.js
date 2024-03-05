const Order = require("../models/Order");
const Cart = require("../models/Cart");


// reusable find() component
const getOrders = (req, res, findParams, errMessage) => {
    Order.find({ findParams })
        .then(foundOrders => {
            if (foundOrders.length > 0) {
                return res.status(200).send({ foundOrders })
            } else {
                return res.status(404).send({ error: errMessage })
            }
        })
        .catch(err => {
            return res.send(500).send({ error: `${errMessage} : ${err}` });
        })
}


module.exports.createOrder = (req, res) => {
    getOrders(req, res, { userId: req.user.id, status: "Pending" }, "Unable to Checkout - No Pending Orders")
        .then(pendingOrders => {
            if (pendingOrders.length < 1) {
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


module.exports.getOrders = (req, res) => {
    getOrders(req, res, { userId: req.user.id }, "User Orders Not Found")
}


module.exports.allOrders = (req, res) => {
    getOrders(req, res, {}, "All Orders Not Found")
}

