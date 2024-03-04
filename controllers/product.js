const Product = require("../models/Product");

module.exports.createProduct = (req, res) => {
	
	const newProduct = new Product({
		name: req.body.name,
		description: req.body.description,
		price: req.body.price
	});

	Product.findOne({ name: req.body.name})
	.then(existingProduct => {
		if(existingProduct) {
			return res.status(409).send({ message: "Product already exists" })
		}

		return newProduct.save()
		.then(savedProduct => {
			return res.status(201).send({
				message: "Product successfully created.",
				savedProduct: savedProduct
			})
		})
		.catch(savErr => {
			console.error("Error in saving the product: ", savErr);
			return res.status(500).send({ error: "Failed to save the product."})
		});
	})
	.catch(findErr => {
		console.error("Error in finding the product: ", findErr);
		return res.status(500).send({ error: "Failed to find the product"});
	});

};

module.exports.getAllProducts = (req, res) => {
	
	Product.find({})
	.then(foundProducts => {
		if(foundProducts.length > 0) {
			return res.status(200).send({
				message: "All products retrieved successfully.",
				allProducts: foundProducts
			})
		}

		return res.status(404).send({ message: "No products found."});
	})
	.catch(findErr => {
		console.error("Error in finding all products: ", findErr);
		return res.status(500).send({ error: "Failed to find products."});
	});

};

module.exports.getAllActive = (req, res) => {
	
	Product.find({
		isActive: true
	})
	.then(foundProducts => {
		if(foundProducts.length > 0) {
			return res.status(200).send({
				message: "All active products retrieved successfully.",
				allActiveProducts: foundProducts
			});
		}
		return res.status(200).send({ message: "No active product found." });
	})
	.catch(findErr => {
		console.error("Error in finding all active products: ", findErr);
		return res.status(500).send({ error: "Failed to find active products" })
	});

};

module.exports.getProduct = (req, res) => {

	const productId = req.params.productId;

	Product.findById(productId)
	.then(foundProduct => {
		if(!foundProduct) {
			return res.status(404).send({ message: "Product not found." });
		}
		return res.status(200).send({
			message: "Product found.",
			singleProduct: foundProduct
		});
	})
	.catch(findErr => {
		console.error("Error in fetching the product: ", findErr);
		return res.status(500).send({ error: "Failed to fetch product" });
	});

};

module.exports.updateProduct = (req, res) => {

	let updatedProduct = {
		name: req.body.name,
		description: req.body.description,
		price: req.body.price
	}

	return Product.findByIdAndUpdate(req.params.productId, updatedProduct)
	.then(foundProduct => {
		if(!foundProduct) {
			return res.status(404).send({ message: "Product not found." });
		}
		return res.status(200).send({
			message: "Product updated successfully",
			updatedProduct: foundProduct
		});
	})
	.catch(findErr => {
		console.error("Error in finding & updating product: ", err);
		return res.status(500).send({ error: "Failed to find & update product." })
	});
};

module.exports.archiveProduct = (req, res) => {
	
	let archiveProduct = {
		isActive: false
	}
	Product.findByIdAndUpdate(req.params.productId, archiveProduct)
	.then(foundProduct => {
		if(!foundProduct) {
			return res.status(404).send({ message: "Product not found." });
		}
		return res.status(200).send({
			message: "Product archived successfully",
			archivedProduct: foundProduct
		});
	})
	.catch(findErr => {
		console.error("Error in finding & archiving product: ", findErr);
		return res.status(500).send({ error: "Failed to find & archive product." });
	});
};

module.exports.activateProduct = (req, res) => {
	
	let activateProduct = {
		isActive: true
	}
	
	Product.findByIdAndUpdate(req.params.productId, activateProduct)
	.then(foundProduct => {
		if(!foundProduct) {
			return res.status(404).send({ message: "Product not found." });
		}
		return res.status(200).send({
			message: "Product activated successfully",
			activatedProduct: foundProduct
		});
	})
	.catch(findErr => {
		console.error("Error in finding & activating product: ", findErr);
		return res.status(500).send({ error: "Failed to find & activate product." });
	});
};