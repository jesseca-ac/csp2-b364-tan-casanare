const express = require("express");
const cartController = require("../controllers/cart");
const auth = require("../auth");
const { verify, verifyAdmin } = auth;

const router = express.Router();

router.post("/add-to-cart", verify, cartController.addToCart);

router.get("/get-cart", verify, cartController.getCart);

router.patch("/update-cart-quantity", verify, cartController.changeQty);

router.patch("/:productId/remove-from-cart", verify, cartController.deleteFromCart);

router.patch("/clear-cart", verify, cartController.clearCart);

module.exports = router;