const express = require("express");
const orderController = require("../controllers/order");
const {verify, verifyAdmin} = require("../auth");
const router = express.Router();

router.post("/checkout", verify, orderController.createOrder);

router.get("/order", verify, orderController.getOrder);

router.get("/all-orders", verify, verifyAdmin, orderController.allOrders);

module.exports = router;