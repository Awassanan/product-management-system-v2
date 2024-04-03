const express = require('express');
const app = express();
const port = 3000;

const products = [
    { id: 1, name: 'Laptop', category: 'Electronics', price: 1000, stock: 5 },
    { id: 2, name: 'Phone', category: 'Electronics', price: 500, stock: 10 },
];

// ---- Middleware ----
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

// Middleware for parsing JSON
app.use(express.json());

// ---- Routing ----
// GET all products
app.get('/products', (req, res) => {
    res.json(products);
});

// GET a single product by ID
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send('Product not found');
    res.json(product);
});

// POST a new product
app.post('/products', (req, res) => {
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock
    };
    products.push(newProduct);
    res.json(newProduct);
});

// PUT to update product
app.put('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send('Product not found');

    product.name = req.body.name;
    product.category = req.body.category;
    product.price = req.body.price;
    product.stock = req.body.stock;

    res.json(product);
});

// DELETE product
app.delete('/products/:id', (req, res) => {
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    if (productIndex === -1) return res.status(404).send('Product not found');

    const deletedProduct = products.splice(productIndex, 1);
    res.json(deletedProduct);
});

app.listen(port, () => {
    console.log(`Server running at <http://localhost>:${port}/`);
});
