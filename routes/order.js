const express = require("express");
const orderController = require("../controllers/order");
const {verify, verifyAdmin} = require("../auth");
const router = express.Router();

router.post("/checkout", verify, orderController.createOrder);

router.get("/orders", verify, orderController.getOrders);

router.get("/all-orders", verify, verifyAdmin, orderController.allOrders);

module.exports = router;