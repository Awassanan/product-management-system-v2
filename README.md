# My Inventory Web Application

This is an inventory web application created using HTML5, CSS3, JavaScript, and the Bootstrap Framework. It enables users to manage their inventory by viewing all products, adding new products, updating existing products, and deleting products.

This project is designed to run locally only. Before using it, please clone the repository. It's recommended to start by running server.js, followed by launching the web app with a live server extension.

This project is part of Dev Init #2 by borntoDev, aiming to create a product management system using Node.js and Express.

## Features

- View all products in a table (GET: "/products").
- Add a new product by clicking the button and inputting data via the modal (POST: "/products").
- Update a selected product by clicking the pencil icon and inputting data via the modal (PUT: "/products/:id").
- Delete a selected product by clicking the trash icon (DELETE: "/products/:id").
- Search for a product by its ID (GET: "/products/:id").
