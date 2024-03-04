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
			message: "User's cart found.",
			userCart: foundCart
		});
	})
	.catch(findErr => {
		console.error("Error in finding cart: ", err);
		return res.send(500).send({ error: "Failed to find cart." });
	});

};

// module.exports.addToCart = (req, res) => {

// 	if(req.user.isAdmin) {
// 		return res.status(403).send({ message: "Admins are forbidden to have a cart." });
// 	}

// 	Cart.findOne({
// 		userId: req.user.id
// 	})
// 	.then(foundCart => {

// 		if(foundCart) {
			
// 		}
// 	})
// }

module.exports.addToCart = (req, res) => {

	if(req.user.isAdmin) {
		return res.status(403).send({ message: "Admins are forbidden to have a cart." });
	}

	Cart.findOne(
		{
			userId: req.user.id
		}
	)
	.then(foundCart => {
		if(foundCart) {
			let total;
			foundCart.cartItems.forEach(cartItem => {
				req.body.cartItems.forEach(bodyItem => {
					
					if(cartItem.productId == bodyItem.productId) {

						cartItem.quantity += bodyItem.quantity;
						Product.findById(bodyItem.productId)
						.then(foundProduct => {
							cartItem.subtotal = cartItem.quantity * foundProduct.price;
							foundCart.totalPrice += cartItem.subtotal;
						})
						.catch(prodErr => {
							console.error("Error in finding product: ", prodErr);
							return res.status(500).send({ error: "Failed to find product" });
						});
						
					}

				});
			});

			//foundCart.totalPrice = total;
			console.error("Cart found");
			
			return foundCart.save()
			.then(saveCart => {
				return res.status(201).send({
					message: "Successfully added to existing cart.",
					addedToCart: saveCart
				});
			})
			.catch(savErr => {
				console.error("Error in saving new cart: ", savErr);
			})
			
		}

		let newCart = new Cart({
			userId: req.user.id,
			cartItems: req.body.cartItems
		});

		let total = 0;

		newCart.cartItems.forEach(cartItem => {
			req.body.cartItems.forEach(bodyItem => {
			Product.findById(bodyItem.productId)
			.then(foundProduct => {
				subtotal = cartItem.quantity * foundProduct.price;

				cartItem.subtotal = subtotal;
				console.log(subtotal);
			})
			.catch(prodErr => {
				console.error("Error in finding product: ", prodErr);
				return res.status(500).send({ error: "Failed to find product" });
			});

			total += cartItem.subtotal;
			console.log(total);
		});	
		})
		
		newCart.totalPrice = total;

		return newCart.save()
		.then(newSave => {
			return res.status(201).send({
				message: "Successfully added to cart.",
				addedToCart: newSave
			});
		})
		.catch(savErr => {
			console.error("New Save error.");
		})

		
	})
	.catch(findErr => {
		console.error("Error in finding and updating cart: ", findErr);
		return res.status(500).send( {
			error: "Failed to find and update cart.",
			message: "Make sure that you createdd a cart."
		})
	});
};


// module.exports.addToCart = (req, res) => {

// 	if(req.user.isAdmin) {
// 		return res.status(403).send({ message: "Admins are forbidden to have a cart." });
// 	}

// 	Cart.findOne(
// 		{
// 			userId: req.user.id
// 		}
// 	)
// 	.then(foundCart => {
// 		if(foundCart) {
// 			let total;
// 			foundCart.cartItems.forEach(cartItem => {
// 				req.body.cartItems.forEach(bodyItem => {
					
// 					if(cartItem.productId == bodyItem.productId) {

// 						cartItem.quantity += bodyItem.quantity;
// 						Product.findById(bodyItem.productId)
// 						.then(foundProduct => {
// 							cartItem.subtotal = cartItem.quantity * foundProduct.price;

// 						})
// 						.catch(prodErr => {
// 							console.error("Error in finding product: ", prodErr);
// 							return res.status(500).send({ error: "Failed to find product" });
// 						});
// 						total += cartItem.subtotal;
// 					}

// 				});
// 			});

// 			foundCart.totalPrice = total;
// 			console.error("Cart found");
			
// 			return foundCart.save()
// 			.then(saveCart => {
// 				return res.status(201).send({
// 					message: "Successfully added to existing cart.",
// 					addedToCart: saveCart
// 				});
// 			})
// 			.catch(savErr => {
// 				console.error("Error in saving new cart: ", savErr);
// 			})
			
// 		}

// 		// let newCart = new Cart({
// 		// 	userId: req.user.id,
// 		// 	cartItems: req.body.cartItems,
// 		// 	totalPrice: req.body.totalPrice
// 		// })

// 		// console.error("No Cart yet.");
// 		// return newCart.save()
// 		// .then(newToCart => {
// 		// 	console.log("New cart created.");
// 		// 	return res.status(201).send({
// 		// 		message: "Successfully adedd to cart.",
// 		// 		addedToCart: newToCart
// 		// 	});
// 		// })
// 		// .catch(savErr => {
// 		// 	console.error("Error in saving new cart: ", savErr);
// 		// 	return res.status(500).send({ error: "Failed to save new cart." });
// 		// });
		
// 	})
// 	.catch(findErr => {
// 		console.error("Error in finding and updating cart: ", findErr);
// 		return res.status(500).send( {
// 			error: "Failed to find and update cart.",
// 			message: "Make sure that you createdd a cart."
// 		})
// 	});
// };

module.exports.changeQty = (req, res) => {

	if(req.user.isAdmin) {
		return res.status(403).send({ message: "Admins are forbidden to have a cart." });
	}

	let count = 0;
	Cart.findOne({ userId: req.user.id })
	.then(foundCart => {
		foundCart.cartItems.forEach(item => {
			if(item.productId == req.params.productId) {
				item.quantity = req.body.quantity;
				//break;
			}
		})

		return res.status(200).send({
			message: "Product quantity updated.",
			updatedProduct: foundCart
		});
		//console.log(foundCart.cartItems[0]);
	})
	.catch(findErr => {
		console.error("Error in finding cart: ", findErr);

	})
};

module.exports.deleteFromCart = (req, res) => {

	if(req.user.isAdmin) {
		return res.status(403).send({ message: "Admins are forbidden to have a cart." });
	}

	Cart.deleteOne(req.params.productId)
	.then(foundProduct => {
		if(!foundProduct) {
			return res.status(404).send({ message: "Product not found." });
		}
		return res.send(200).send({
			message: "Product successfully deleted.",
			deletedProduct: foundProduct
		});
	})
	.catch(delErr => {
		console.error("Error in deleting product: ", delErr);
		return res.status(500).send({ error: "Failed to delete product." })
	})
}

module.exports.clearCart = (req, res) => {

	if(req.user.isAdmin) {
		return res.status(403).send({ message: "Admins are forbidden to have a cart." });
	}

	Cart.findByIdAndDelete(req.user.id)
	.then(foundCart => {
		if(!foundCart) {
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