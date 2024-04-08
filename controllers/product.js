const Product = require("../models/Product");


module.exports.createProduct = (req, res) => {

	const newProduct = new Product({
		name: req.body.name,
		description: req.body.description,
		price: req.body.price,
		imgLink: req.body.imgLink
	});

	Product.findOne({ name: req.body.name })
		.then(existingProduct => {
			if (existingProduct) {
				return res.status(409).send({ error: "Product already exists" })
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
					return res.status(500).send({ error: "Failed to save the product." })
				});
		})
		.catch(findErr => {
			console.error("Error in finding the product: ", findErr);
			return res.status(500).send({ error: "Failed to find the product" });
		});

};


module.exports.getAllProducts = (req, res) => {

	Product.find({})
		.then(foundProducts => {
			if (foundProducts.length > 0) {
				return res.status(200).send({
					message: "Products retrieved successfully.",
					foundProducts: foundProducts
				})
			}

			return res.status(404).send({ message: "No products found." });
		})
		.catch(findErr => {
			console.error("Error in finding all products: ", findErr);
			return res.status(500).send({ error: "Failed to find products." });
		});

};


module.exports.getAllActive = (req, res) => {

	Product.find({
		isActive: true
	})
		.then(foundProducts => {
			if (foundProducts.length > 0) {
				return res.status(200).send({
					message: "Products retrieved successfully.",
					foundProducts: foundProducts
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
			if (!foundProduct) {
				return res.status(404).send({ message: "Product not found." });
			}
			return res.status(200).send({
				message: "Product found.",
				foundProduct: foundProduct
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
		price: req.body.price,
		imgLink: req.body.imgLink
	}

	return Product.findByIdAndUpdate(req.params.productId, updatedProduct)
		.then(foundProduct => {
			if (!foundProduct) {
				return res.status(404).send({ message: "Product not found." });
			}
			return res.status(200).send({
				message: "Product updated successfully",
				fondProduct: foundProduct
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
			if (!foundProduct) {
				return res.status(404).send({ message: "Product not found." });
			}
			return res.status(200).send({
				message: "Product archived successfully",
				foundProduct: foundProduct
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
			if (!foundProduct) {
				return res.status(404).send({ message: "Product not found." });
			}
			return res.status(200).send({
				message: "Product activated successfully",
				foundProduct: foundProduct
			});
		})
		.catch(findErr => {
			console.error("Error in finding & activating product: ", findErr);
			return res.status(500).send({ error: "Failed to find & activate product." });
		});
};


module.exports.searchByName = async (req, res) => {
	try {
	  const { productName } = req.body;
  
	  // Use a regular expression to perform a case-insensitive search
	  const products = await product.find({
		name: { $regex: productName, $options: 'i' }
	  });
  
	  res.json(products);
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
};


// module.exports.searchByPrice = (req, res) => {

// 	Product.find({ price: req.body.price })
// 		.then(foundProducts => {
// 			if (!foundProducts) {
// 				return res.status(404).send({ message: "Product not found." });
// 			}
// 			return res.status(200).send({ foundProducts });
// 		})
// 		.catch(err => {
// 			return res.status(500).send({ error: `Error finding products: ${err}` });
// 		});
// }