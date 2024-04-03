const baseURL = 'http://localhost:3000/products/'

// GET all
async function getProducts() {
    await fetch(baseURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            data.forEach(element => {
                document.getElementById("tbody").innerHTML += `<tr id="${"product" + element._id}">
                <th scope="row" id="${"row" + element._id}">${element._id}</th>
                <td>
                    <div class="d-flex justify-content-between" style="width:60%">
                        <i class="bi-pencil-square" onclick='updateProductModal(${element._id}, "${element.name}", "${element.category}", ${element.price}, ${element.stock})'></i>
                        <i class="bi-trash-fill" onclick="deleteProduct('${element._id}')"></i>
                    </div>
                </td>
                <td>${element.name}</td>
                <td>${element.category}</td>
                <td>${element.price}&nbsp;Baht</td>
                <td>${element.stock}</td>
            </tr>`
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// GET by id
async function searchById(id) {
    if (id.trim() === "") {
        document.getElementById("tbody").innerHTML = "";
        getProducts();
        return;
    }

    await fetch(baseURL + id)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    console.log(response)
                    document.getElementById("tbody").innerHTML = `<tr><td colspan="6">Product not found</td></tr>`;
                    return;
                } else {
                    throw new Error('Network response was not ok');
                }
            }
            return response.json();
        })
        .then(data => {
            if (!data) {
                return;
            }
            console.log(data);

            document.getElementById("tbody").innerHTML = `<tr id="${"product" + data._id}">
                <th scope="row" id="${"row" + data._id}">${data._id}</th>
                <td>
                    <div class="d-flex justify-content-between" style="width:60%">
                        <i class="bi-pencil-square" onclick='updateProductModal(${data._id}, "${data.name}", "${data.category}", ${data.price}, ${data.stock})'></i>
                        <i class="bi-trash-fill" onclick="deleteProduct('${data._id}')"></i>
                    </div>
                </td>
                <td>${data.name}</td>
                <td>${data.category}</td>
                <td>${data.price}&nbsp;Baht</td>
                <td>${data.stock}</td>
            </tr>`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.getElementById('form1').addEventListener('input', function (event) {
    const searchValue = event.target.value.trim();
    searchById(searchValue);
});

// DELETE
async function deleteProduct(id) {
    await fetch(baseURL + id, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            document.getElementById("tbody").removeChild(document.getElementById(`product${id}`));
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function clearInputField() {
    document.getElementById('name').value = "";
    document.getElementById('category').value = "";
    document.getElementById('price').value = "";
    document.getElementById('stock').value = "";
}

function newProductModal() {
    var modal = document.getElementById('myModal');
    var bootstrapModal = new bootstrap.Modal(modal);
    document.getElementById("myModalLabel").innerHTML = "New Product Info"

    clearInputField()

    let lastchild = document.getElementById("tbody").lastChild
    let nextId;
    let lastId;
    try {
        lastId = parseInt((lastchild.id).substring(lastchild.id.length - 1, lastchild.id.length))
        nextId = lastId + 1
    }
    catch {
        nextId = 1
    }
    finally {
        console.log(lastId)
    }

    document.getElementById('productId').placeholder = nextId;
    document.getElementById('name').placeholder = "name";
    document.getElementById('category').placeholder = "category";
    document.getElementById('price').placeholder = "price";
    document.getElementById('stock').placeholder = "stock";

    document.getElementById('saveChangesButton').onclick = function () {
        var postData = {
            _id: nextId,
            name: document.getElementById('name').value,
            category: document.getElementById('category').value,
            price: parseFloat(document.getElementById('price').value),
            stock: parseInt(document.getElementById('stock').value)
        };
        newProduct(postData);
        bootstrapModal.hide();
    };

    bootstrapModal.show();
}

// POST
async function newProduct(postData) {
    await fetch(baseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);

            document.getElementById("tbody").innerHTML += `<tr id="product${data._id}">
            <th scope="row" id="row${data._id}">${data._id}</th>
            <td>
                <div class="d-flex justify-content-between" style="width:60%">
                    <i class="bi-pencil-square" onclick='updateProductModal(${data._id}, "${data.name}", "${data.category}", ${data.price}, ${data.stock})'></i>
                    <i class="bi-trash-fill" onclick="deleteProduct('${data._id}')"></i>
                </div>
            </td>
            <td>${data.name}</td>
            <td>${data.category}</td>
            <td>${data.price}&nbsp;Baht</td>
            <td>${data.stock}</td>
        </tr>`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// PUT
function updateProductModal(id, name, category, price, stock) {
    var modal = document.getElementById('myModal');
    var bootstrapModal = new bootstrap.Modal(modal);
    document.getElementById("myModalLabel").innerHTML = "Update Product Info"

    clearInputField()

    document.getElementById('productId').placeholder = id;
    document.getElementById('name').placeholder = name;
    document.getElementById('category').placeholder = category;
    document.getElementById('price').placeholder = price;
    document.getElementById('stock').placeholder = stock;

    document.getElementById('saveChangesButton').onclick = function () {
        var updateData = {
            _id: id,
            name: document.getElementById('name').value,
            category: document.getElementById('category').value,
            price: parseFloat(document.getElementById('price').value),
            stock: parseInt(document.getElementById('stock').value)
        };
        updateProduct(updateData);
        bootstrapModal.hide();
    };

    bootstrapModal.show();
}

async function updateProduct(updateData) {
    await fetch(baseURL + updateData._id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);

            // Update the DOM elements of the corresponding table row
            const row = document.getElementById(`product${data._id}`);
            row.querySelector('td:nth-child(3)').textContent = data.name;
            row.querySelector('td:nth-child(4)').textContent = data.category;
            row.querySelector('td:nth-child(5)').textContent = `${data.price} Baht`;
            row.querySelector('td:nth-child(6)').textContent = data.stock;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

getProducts()