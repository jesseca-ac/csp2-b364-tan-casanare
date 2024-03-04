const express = require("express");
const orderController = require("../controllers/order");
const {verify, verifyAdmin} = require("../auth");
const router = express.Router();

router.post("/createOrder", verify, orderController.createOder);

router.get("/getOrder", verify, orderController.getOrder);

router.get("/getAllOrders", verify, verifyAdmin, orderController.getAllOrders);

module.exports = router;