const Order = require("../models/Order");
const Cart = require("../models/Cart");



module.exports.getOrder = (req, res) => {
    
}


module.exports.allOrders = (req, res) => {
    
}


module.exports.checkout = (req, res) => {

}


// module.exports.getCart = (req, res) => {

// 	if (req.user.isAdmin) {
// 		return res.status(403).send({ message: "Admins are forbidden to have a cart." });
// 	}

// 	Cart.findOne({
// 		userId: req.user.id
// 	})
// 		.then(foundCart => {
// 			if (!foundCart) {
// 				return res.status(404).send({ message: "Cart not found." });
// 			}
// 			return res.status(200).send({
// 				message: "User's cart found.",
// 				userCart: foundCart
// 			});
// 		})
// 		.catch(findErr => {
// 			console.error("Error in finding cart: ", err);
// 			return res.send(500).send({ error: "Failed to find cart." });
// 		});

// };