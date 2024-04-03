const express = require('express');
const mongoose = require('mongoose');

const app = express();

// ติดต่อ MongoDB
mongoose.connect('mongodb://localhost:27017/productDB', { useNewUrlParser: true, useUnifiedTopology: true });

// สร้าง Schema และ Model
const productSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    category: String,
    price: Number,
    stock: Number
});

const Product = mongoose.model('Product', productSchema);

// Middleware

// Middleware for logging
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

// Middleware using JSON
app.use(express.json());

// Add product
app.post('/products', (req, res) => {
    const newProduct = new Product(req.body)

    if (!req.body._id || !req.body.name || !req.body.category || !req.body.price || !req.body.stock) {
        return res.status(400).send("Bad Request: Incomplete fields");
    }

    newProduct.save()
        .then((savedProduct) => {
            res.status(201).send(savedProduct);
        })
        .catch((err) => {
            if (err.code === 11000) { // Duplicate key error code: E11000
                res.status(400).send("Duplicate ID");
            } else {
                res.status(500).send("Internal Server Error");
            }
        });
});

// Get Products
app.get('/products', (req, res) => {
    Product.find()
        .then((products) => {
            return res.status(200).send(products);
        })
        .catch((err) => {
            console.error("Error fetching all products:", err);
            res.status(500).send("Internal Server Error");
        });
});


// Get Product By ID
app.get('/products/:id', (req, res) => {
    Product.findById(req.params.id)
        .then((product) => {
            if (!product) {
                return res.status(404).send("Not Found: Product not found");
            }
            return res.status(200).send(product);
        })
        .catch((err) => {
            console.error("Error finding product:", err);
            res.status(500).send("Internal Server Error");
        });
})

// Edit Product Details
app.put('/products/:id', (req, res) => {
    Product.updateOne({ _id: req.params.id }, req.body)
        .then(Product.findById(req.params.id)
            .then((product) => {
                if (!product) {
                    return res.status(404).send("Not Found: Product not found");
                } else if (!req.body._id || !req.body.name || !req.body.category || !req.body.price || !req.body.stock) {
                    return res.status(400).send("Bad Request: Incomplete fields");
                }
                console.log("Updated Successfully")
                return res.status(200).send(req.body);
            })
            .catch((err) => {
                console.error("Error finding product:", err);
                res.status(500).send("Internal Server Error");
            }))
        .catch((err) => {
            console.error("Error updating product:", err);
            res.status(500).send("Internal Server Error");
        });
});

// Delete product
app.delete('/products/:id', (req, res) => {
    Product.deleteOne({ _id: req.params.id })
        .then(Product.findById(req.params.id)
            .then((product) => {
                if (!product) {
                    return res.status(404).send("Not Found: Product not found");
                }
                return res.status(200).send("Deleted successfully");
            })
            .catch((err) => {
                console.error("Error finding product:", err);
                res.status(500).send("Internal Server Error");
            }))
        .catch((err) => {
            console.error("Error deleting product:", err);
            res.status(500).send("Internal Server Error");
        });
});

// Run server at port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});