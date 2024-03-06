const express = require("express");
const cartController = require("../controllers/cart");
const auth = require("../auth");
const { verify, verifyAdmin } = auth;

const router = express.Router();

router.post("/addToCart", verify, cartController.addToCart);

router.get("/getCart", verify, cartController.getCart);

router.patch("/:productId/changeQty", verify, cartController.changeQty);

router.patch("/:productId/remove-from-cart", verify, cartController.removeFromCart);

router.patch("/clear-cart", verify, cartController.clearCart);

module.exports = router;