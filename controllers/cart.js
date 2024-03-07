const Product = require("../models/Product");
const Cart = require("../models/Cart");


module.exports.getCart = (req, res) => {

	if(req.user.isAdmin) {
		return res.status(403).send({ message: "Admins are forbidden to have a cart." });
	}
		
	Cart.findOne({
		userId: req.user.id
	})
	.then(foundCart => {
		if(!foundCart) {
			return res.status(404).send({ message: "Cart not found." });
		}
		return res.status(200).send({
			message: "Here is the user's cart.",
			userCart: foundCart
		});
	})
	.catch(findErr => {
		console.error("Error in finding user's cart: ", err);
		return res.send(500).send({ error: "Failed to find user's cart." });
	});

};


module.exports.addToCart = (req, res) => {
    if (req.user.isAdmin) {
        return res.status(403).send({ message: "Admins are forbidden to have a cart." });
    }

    Cart.findOne({ userId: req.user.id })
        .then(foundCart => {
            if (foundCart) {
                // Update existing cart
                req.body.cartItems.forEach(bodyItem => {
                    const existingCartItem = foundCart.cartItems.find(cartItem => cartItem.productId == bodyItem.productId);
                    if (existingCartItem) {
                        existingCartItem.quantity += bodyItem.quantity;
                    } else {
                        foundCart.cartItems.push(bodyItem);
                    }
                });

                // Update subtotal and total price for each cart item
                const promises = foundCart.cartItems.map(cartItem => {
                    return Product.findById(cartItem.productId)
                        .then(foundProduct => {
                            cartItem.subtotal = cartItem.quantity * foundProduct.price;
                            return cartItem.subtotal;
                        })
                        .catch(prodErr => {
                            console.error("Error in finding product for price: ", prodErr);
                            return res.status(500).send({ error: "Failed to find product for price." })
                        });
                });

                return Promise.all(promises)
                    .then(subtotals => {
                        foundCart.totalPrice = subtotals.reduce((total, subtotal) => total + subtotal, 0);
                        return foundCart.save();
                    })
                    .then(savedCart => {
                        return res.status(201).send({
                            message: "Successfully updated existing cart.",
                            updatedCart: savedCart
                        });
                    })
                    .catch(err => {
                        console.error("Error updating existing cart:", err);
                        return res.status(500).send({ error: "Failed to update existing cart" });
                    });
            } else {
                // Create new cart
                let newCart = new Cart({
                    userId: req.user.id,
                    cartItems: req.body.cartItems
                });

                const promises = newCart.cartItems.map(cartItem => {
                    return Product.findById(cartItem.productId)
                        .then(foundProduct => {
                            cartItem.subtotal = cartItem.quantity * foundProduct.price;
                            return cartItem.subtotal;
                        })
                        .catch(prodErr => {
                            console.error("Error in finding product for price: ", prodErr);
                            return res.status(500).send({ error: "Failed to find product price." });
                        });
                });

                return Promise.all(promises)
                    .then(subtotals => {
                        newCart.totalPrice = subtotals.reduce((total, subtotal) => total + subtotal, 0);
                        return newCart.save();
                    })
                    .then(savedCart => {
                        return res.status(201).send({
                            message: "Successfully added to cart.",
                            addedToCart: savedCart
                        });
                    })
                    .catch(err => {
                        console.error("Error saving new cart:", err);
                        return res.status(500).send({ error: "Failed to save new cart" });
                    });
            }
        })
        .catch(findErr => {
            console.error("Error in finding cart: ", findErr);
            return res.status(500).send({ error: "Failed to find cart." });
        });
};


module.exports.changeQty = (req, res) => {
	if (req.user.isAdmin) {
        return res.status(403).send({ message: "Admins are forbidden to have a cart." });
    }

	Cart.findOne({
		userId: req.user.id
	})
	.then(foundCart => {
		if(foundCart)
		{
			const existingCartItem = foundCart.cartItems.find(cartItem => cartItem.productId == req.body.productId);
            if (existingCartItem) {
                existingCartItem.quantity = req.body.quantity;
                const promises = foundCart.cartItems.map(cartItem => {
	                return Product.findById(cartItem.productId)
	                .then(foundProduct => {
	                    cartItem.subtotal = cartItem.quantity * foundProduct.price;
	                    return cartItem.subtotal;
	                })
	                .catch(prodErr => {
	                    console.error("Error in finding product for price: ", prodErr);
	                    return res.status(500).send({ error: "Failed to find product for price." });
	                });
	            });

	            return Promise.all(promises)
	            .then(subtotals => {
	                foundCart.totalPrice = subtotals.reduce((total, subtotal) => total + subtotal, 0);
	                return foundCart.save();
	            })
	            .then(savedCart => {
	                return res.status(201).send({
	                    message: "Successfully updated existing cart.",
	                    updatedCart: savedCart
	                });
	            })
	            .catch(err => {
	                console.error("Error updating existing cart:", err);
	                return res.status(500).send({ error: "Failed to update existing cart" });
	            });
            }
            
		}

		return res.status(404).send({ message: "Product does not exist in cart." });
	})
	.catch(findErr => {
		console.error("Error in finding cart: ", findErr);
		return res.status(500).send({ error: "Failed to find cart" });
	})
};


module.exports.deleteFromCart = (req, res) => {
	if (req.user.isAdmin) {
		return res.status(403).send({ message: "Admins are forbidden to have a cart." });
	}

	Cart.findOne({ userId: req.user.id })
		.then(foundCart => {
			if (!foundCart) {
				return res.status(404).send({ message: "Cart not found." });
			}

			const productId = req.body.productId;
			const index = foundCart.cartItems.findIndex(item => item.productId == productId);

			
			if (index === -1) {
				return res.status(404).send({ message: "Product not found in cart." });
			}
			
			if (index !== -1) {
				foundCart.cartItems.splice(index, 1);
				
				const promises = foundCart.cartItems.map(cartItem => {
					return Product.findById(cartItem.productId)
						.then(foundProduct => {
							cartItem.subtotal = cartItem.quantity * foundProduct.price;
							return cartItem.subtotal;
						})
						.catch(prodErr => {
							console.error("Error in finding produc for pricet: ", prodErr);
							return res.status(500).send({ error: "Failed to find product for price." });
						});
				});
	
				return Promise.all(promises)
					.then(subtotals => {
						foundCart.totalPrice = subtotals.reduce((total, subtotal) => total + subtotal, 0);
						return foundCart.save();
					})
					.then(savedCart => {
						return res.status(200).send({
							message: "Product successfully deleted from cart.",
							updatedCart: savedCart
						});
					})
					.catch(err => {
						console.error("Error updating cart:", err);
						return res.status(500).send({ error: "Failed to update cart." });
					});
			}

		})
		.catch(findErr => {
			console.error("Error finding cart: ", findErr);
			return res.status(500).send({ error: "Failed to find cart." });
		});
};


module.exports.clearCart = (req, res) => {

	if(req.user.isAdmin) {
		return res.status(403).send({ message: "Admins are forbidden to have a cart." });
	}

	Cart.findOneAndUpdate({
		userId: req.user.id
	},
	{
		cartItems: [],
		totalPrice: 0
	})
	.then(foundCart => {
		if(foundCart) {
			return res.status(200).send({
				message: "Cart cleared successfully."
			})
		}
		console.log(req.user.id);
		return res.status(404).send({ message: "Cart not found." });
	})
	.catch(findErr => {
		console.error("Error in finding cart: ", findErr);
		return res.status(500).send({ error: "Failed to find and update cart." });
	})
}

