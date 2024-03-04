const express = require("express");
const cartController = require("../controllers/cart");
const auth = require("../auth");
const { verify, verifyAdmin } = auth;

const router = express.Router();

router.post("/addToCart", verify, cartController.addToCart);

router.get("/getCart", verify, cartController.getCart);

router.patch("/:productId/changeQty", verify, cartController.changeQty);

module.exports = router;