require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// MongoDB 
//mongoose.connect(`${process.env.mongoConnectionString}`);
mongoose.connect("mongodb+srv://rjstan03:admin1234@cluster0.mshqgl2.mongodb.net/b364-csp3-tan");
mongoose.connection.once('open', () => console.log("Connected to MongoDB"));

// Server Setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Access to backend application
app.use(cors());


// ROUTES START

const users = require("./routes/user");
app.use("/b1/users", users);
const products = require("./routes/product");
app.use("/b1/products", products);
const cart = require("./routes/cart");
app.use("/b1/cart", cart);
const orders = require("./routes/order");
app.use("/b1/orders", orders);

// ROUTES END

// Environment Setup
const PORT = 4001;
if(require.main === module){
	app.listen(PORT, () => {
		console.log(`API Running on PORT ${PORT}`)
	});
}

module.exports = app;