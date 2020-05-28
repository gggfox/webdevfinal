const API_TOKEN = "'2abbf7c3-245b-404f-9473-ade729ed4653'";

function updateProduct(id, name, price, desc) {
    let url = `/product/${id}`;
    let data = {
        id: id,
        name: name,
        precio: price,
        description: desc
    };
    let settings = {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                getAllProducts();
                return {};
            }
            throw new Error(response.statusText);
        })
        .catch(err => {
            console.log(err.message);
        });

}

function watchupdatebtn(id) {
    let btn = document.getElementById('update_product');
    btn.addEventListener('click', event => {
        event.preventDefault();
        let name = document.getElementById('update_product_name');
        let price = document.getElementById('update_product_price');
        let description = document.getElementById('update_product_description');
        let err = document.getElementById('update_product_err');
        name = name.value;
        price = price.value;
        description = description.value;
        err.innerHTML = ""
        if (!name || !price || !description) {
            err.innerHTML = "algo falta";
        }
        if (isNaN(price)) {
            err.innerHTML = "el precio no es un numero";
        } else {
            if (err.innerHTML === "") {
                updateProduct(id, name, price, description);
            }
        }


    })
}

function updateBtn() {
    let table = document.querySelector('.product-list');

    len = table.childNodes.length;
    for (let i = 1; i < len; i++) {
        let btn = table.childNodes[i].childNodes[0].childNodes[7];
        regex = /(<([^>]+)>)/ig
        let id = table.childNodes[i].childNodes[0].childNodes[1].innerHTML.trim().replace(regex, "");
        let name = table.childNodes[i].childNodes[0].childNodes[3].innerHTML.trim().replace(regex, "");
        let price = table.childNodes[i].childNodes[0].childNodes[5].innerHTML.trim().replace(regex, "");
        let desc = table.childNodes[i].childNodes[0].childNodes[11].innerHTML.trim().replace(regex, "");

        btn.addEventListener('click', event => {
            event.preventDefault();
            let display = document.getElementById('updt-dashboard');
            content = `       
            <div class="update-product">
                <form action="" class="product-control">
                    <h1 class="title">ACTUALIZAR PRODUCTO</h1>
                    <span id="update_product_err" class="err"></span>
                    <input id="update_product_name"type="text" name="" placeholder="nombre del producto" value="${name}">
                    <input id="update_product_price"type="text" name="" placeholder="precio del producto" value="${price}">
                    <textarea id="update_product_description"name="" id="description" cols="30" rows="10" > ${desc}</textarea>
                    
                    <input id="update_product"type="submit" name="" value="Actualizar">
                </form>
            </div>`;
            display.innerHTML = content;
            watchupdatebtn(id);
        })

    }
}

function triggerDel(id) {
    regex = /(<([^>]+)>)/ig
    result = id.replace(regex, "");

    let url = `/product/${result}`;

    let settings = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    };

    fetch(url, settings)
        .then(() => {
            getAllProducts();
        })
        .catch(err => {
            console.log(err.message);
        })
}

function deleteBtn() {
    let table = document.querySelector('.product-list');

    len = table.childNodes.length;
    for (let i = 2; i < len; i++) {
        let delbtn = table.childNodes[i].childNodes[0].childNodes[9];
        delbtn.addEventListener('click', event => {
            event.preventDefault();
            let id = table.childNodes[i].childNodes[0].childNodes[1].innerHTML.trim();

            let result = confirm("Want to delete?");
            if (result) {
                triggerDel(id);
            }
        })
    }
}

function getAllProducts() {
    let url = '/products';
    let settings = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    };
    let shop_display = document.querySelector('.product-list');
    shop_display.innerHTML =
        `<tr>
    <th class="product-text product-id">Id</th>
    <th class="product-text product-name">Nombre </th>
    <th class="product-text product-price">Precio </th>
    <th class="product-update-btn">Actualizar</th>
    <th class="product-delete-btn">Eliminar</th>
    </tr>`;
    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {

            responseJSON.forEach(element => {
                let content =
                    `<tr>
                    <td class="product-id">
                        <p>${element.id}</p>
                    </td>

                    <td class="product-name">
                        <p>${element.name}</p>
                    </td>

                    <td class="product-price">
                        <p>$${element.precio}</p>
                    </td>
                    <td>
                        <button class="update-btn">  </button>
                    </td>
                    <td>
                        <button class="delete-btn">  </button>
                    </td>
                    <td class="product-description">
                    <p>${element.description}</p>
                </td>
                </tr>`;
                shop_display.innerHTML += content;
            });
            deleteBtn();
            updateBtn();
        })
        .catch(err => {
            shop_display.innerHTML = `<div> ${err.message} </div>`;
        });
}

function post_product(Name, Description, price) {

    let url = '/products'
    let data = {
        name: Name,
        description: Description,
        precio: price
    };
    let settings = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            console.log(responseJSON);
            getAllProducts();
        })
        .catch(err => {
            console.log(err.message);
        })
}

function watchAddProducts() {
    let addbtn = document.getElementById('add_product');
    addbtn.addEventListener('click', event => {
        event.preventDefault();
        let name = document.getElementById('add_product_name');
        let price = document.getElementById('add_product_price');
        let description = document.getElementById('add_product_description');
        let error = document.getElementById('add_product_err');

        error.innerHTML = "";

        if (!name.value || !price.value || !description.value) {
            error.innerHTML = '<p class="err">Falta llenar algun recuadro </p>';
        }
        if (isNaN(price.value)) {
            error.innerHTML = '<p class="err">El precio no es un numero</p>';
        }
        if (error.innerHTML === "") {
            post_product(name.value, description.value, price.value);
        }

    })
}

function getAllOrders() {
    let url = `/orders`;
    let settings = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    }

    let display = document.getElementById('admin-order-list');
    display.innerHTML = `                    
    <tr>
        <th class="title"> Producto </th>
        <th class="title"> Direccion </th>
        <th class="title"> Email </th>
        <th class="title"> Tarjeta </th>
    </tr>`;

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            responseJSON.forEach(element => {
                display.innerHTML += `                    
                <tr>
                    <td><p> ${element.productName}</p></td>
                    <td><p> ${element.address}</p></td>
                    <td><p> ${element.userEmail}</p></td>
                    <td><p> ${element.address}</p></td>
                </tr>`;
            })
        })
        .catch(err => {
            console.log(err.message);
        });
}

function init() {
    getAllProducts();
    watchAddProducts();
    getAllOrders();

}

init();