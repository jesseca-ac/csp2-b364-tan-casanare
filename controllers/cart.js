const Product = require("../models/Product");
const Cart = require("../models/Cart");

module.exports.getCart = (req, res) => {

	if (req.user.isAdmin) {
		return res.status(403).send({ message: "Admins are forbidden to have a cart." });
	}

	Cart.findOne({
		userId: req.user.id
	})
		.then(foundCart => {
			if (!foundCart) {
				return res.status(404).send({ message: "Cart not found." });
			}
			return res.status(200).send({
				message: "User's cart found.",
				userCart: foundCart
			});
		})
		.catch(findErr => {
			console.error("Error in finding cart: ", err);
			return res.send(500).send({ error: "Failed to find cart." });
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
							console.error("Error in finding product: ", prodErr);
							throw new Error("Failed to find product");
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
							console.error("Error in finding product: ", prodErr);
							throw new Error("Failed to find product");
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
			return res.status(500).send({
				error: "Failed to find cart."
			});
		});
};


// module.exports.changeQty = (req, res) => {

// 	if(req.user.isAdmin) {
// 		return res.status(403).send({ message: "Admins are forbidden to have a cart." });
// 	}

// 	let count = 0;
// 	Cart.findOne({ userId: req.user.id })
// 	.then(foundCart => {
// 		foundCart.cartItems.forEach(item => {
// 			if(item.productId == req.params.productId) {
// 				item.quantity = req.body.quantity;

// 			}
// 		})

// 		return res.status(200).send({
// 			message: "Product quantity updated.",
// 			updatedProduct: foundCart
// 		});
// 		//console.log(foundCart.cartItems[0]);
// 	})
// 	.catch(findErr => {
// 		console.error("Error in finding cart: ", findErr);

// 	})
// };

module.exports.changeQty = (req, res) => {
	if (req.user.isAdmin) {
		return res.status(403).send({ message: "Admins are forbidden to have a cart." });
	}

	Cart.findOne({ userId: req.user.id })
		.then(foundCart => {
			if (!foundCart) {
				return res.status(404).send({ message: "Cart not found." });
			}

			let updated = false;
			foundCart.cartItems.forEach(item => {
				if (item.productId == req.params.productId) {
					item.quantity = req.body.quantity;
					updated = true;
				}
			});

			if (!updated) {
				return res.status(404).send({ message: "Product not found in cart." });
			}

			const promises = foundCart.cartItems.map(cartItem => {
				return Product.findById(cartItem.productId)
					.then(foundProduct => {
						cartItem.subtotal = cartItem.quantity * foundProduct.price;
						return cartItem.subtotal;
					})
					.catch(prodErr => {
						console.error("Error in finding product: ", prodErr);
						throw new Error("Failed to find product");
					});
			});

			return Promise.all(promises)
				.then(subtotals => {
					foundCart.totalPrice = subtotals.reduce((total, subtotal) => total + subtotal, 0);
					return foundCart.save();
				})
				.then(savedCart => {
					return res.status(200).send({
						message: "Product quantity updated.",
						updatedProduct: savedCart
					});
				})
				.catch(err => {
					console.error("Error updating cart:", err);
					return res.status(500).send({ error: "Failed to update cart." });
				});
		})
		.catch(findErr => {
			console.error("Error finding cart: ", findErr);
			return res.status(500).send({ error: "Failed to find cart." });
		});
};

// module.exports.deleteFromCart = (req, res) => {

// 	if (req.user.isAdmin) {
// 		return res.status(403).send({ message: "Admins are forbidden to have a cart." });
// 	}

// 	Cart.deleteOne(req.params.productId)
// 		.then(foundProduct => {
// 			if (!foundProduct) {
// 				return res.status(404).send({ message: "Product not found." });
// 			}
// 			return res.send(200).send({
// 				message: "Product successfully deleted.",
// 				deletedProduct: foundProduct
// 			});
// 		})
// 		.catch(delErr => {
// 			console.error("Error in deleting product: ", delErr);
// 			return res.status(500).send({ error: "Failed to delete product." })
// 		})
// }


module.exports.deleteFromCart = (req, res) => {
	if (req.user.isAdmin) {
		return res.status(403).send({ message: "Admins are forbidden to have a cart." });
	}

	Cart.findOne({ userId: req.user.id })
		.then(foundCart => {
			if (!foundCart) {
				return res.status(404).send({ message: "Cart not found." });
			}

			const productId = req.params.productId;
			const index = foundCart.cartItems.findIndex(item => item.productId == productId);

			if (index === -1) {
				return res.status(404).send({ message: "Product not found in cart." });
			}

			foundCart.cartItems.splice(index, 1);

			const promises = foundCart.cartItems.map(cartItem => {
				return Product.findById(cartItem.productId)
					.then(foundProduct => {
						cartItem.subtotal = cartItem.quantity * foundProduct.price;
						return cartItem.subtotal;
					})
					.catch(prodErr => {
						console.error("Error in finding product: ", prodErr);
						throw new Error("Failed to find product");
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
		})
		.catch(findErr => {
			console.error("Error finding cart: ", findErr);
			return res.status(500).send({ error: "Failed to find cart." });
		});
};


module.exports.clearCart = (req, res) => {

	if (req.user.isAdmin) {
		return res.status(403).send({ message: "Admins are forbidden to have a cart." });
	}

	Cart.findByIdAndDelete(req.user.id)
		.then(foundCart => {
			if (!foundCart) {
				return res.status(404).send({ message: "Cart not found." });
			}
			return res.send(200).send({
				message: "Cart cleared successfully.",
				clearedCart: foundCart
			});
		})
		.catch(clearErr => {
			console.error("Error in clearing cart: ", clearErr);
			return res.status(500).send({ error: "Failed to clear cart." })
		})
}