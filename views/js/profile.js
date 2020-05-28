const API_TOKEN = "'2abbf7c3-245b-404f-9473-ade729ed4653'";
var globalemail = "";

function triggerDel(id, email) {
    let url = `/shoppingcart/${id}`;

    let settings = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    };

    fetch(url, settings)
        .then(() => {
            showShoppingCart(email);
        })
        .catch(err => {
            console.log(err.message);
        })
}

function activateDelBtn(email) {
    let table = document.getElementById('item-list');
    let len = table.childNodes.length;
    for (let i = 2; i < len; i++) {
        let delbtn = table.childNodes[i].childNodes[0].childNodes[5];
        delbtn.addEventListener('click', event => {
            let id = table.childNodes[i].childNodes[0].childNodes[7].innerHTML.trim();
            regex = /(<([^>]+)>)/ig
            id = id.replace(regex, "");

            let result = confirm("Seguro que lo quieres borrar?");
            if (result) {
                console.log(id);
                triggerDel(id, email);
            }
        })
    }

}

function displayCart(productName, ItemId, email) {
    let url = `/product/${productName}`;
    let settings = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    };
    let display = document.getElementById('item-list');
    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            responseJSON.forEach(element => {
                let content = `<tr>
                <td><p>${element.name}</p></td>
                <td><p>${element.precio}</p></td>
                <td><button class="delete-btn">  X  </button></td>
                <td class="invisible"><p>${ItemId}</p></td>
                </tr>`;
                display.innerHTML += content;
            });
            activateDelBtn(email)
        })
        .catch(err => {
            display.innerHTML = `<div> ${err.message} </div>`;
        });
}

function showShoppingCart(email) {
    let url = `/shoppingcart/${email}`;
    let settings = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    }

    let display = document.getElementById('item-list');
    display.innerHTML = `                    <tr>
    <th class="title product-text product-name">Nombre </th>
    <th class="title product-text product-price">Precio </th>
    <th class="title product-delete-btn">Borrar</th>
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
                displayCart(element.productName, element.id, email);
            })
        })
        .catch(err => {
            console.log(err.message);
        });

}

function hello() {
    let url = "/validate-token";
    let settings = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            sessiontoken: localStorage.getItem('token')
        }
    };

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            let greeting = document.querySelector('.welcome');
            greeting.innerHTML = `Bienvenido de regreso ${responseJSON.username}!`;
            globalemail = responseJSON.email;
            showShoppingCart(responseJSON.email);
        })
        .catch(err => {
            console.log(err.message);
            window.location.href = "/index.html";
        });
}

function hacerpedido() {
    let btn = document.getElementById('orderbtn');
    let show = false;
    let pedido = document.getElementById('buynow');
    btn.addEventListener('click', event => {
        event.preventDefault();
        show = !show;
        if (show) {
            pedido.innerHTML = `<div class="inputs">
            <input id="cc" class="textinput" type="text" placeholder="tarjeta de credito">
            <input id="address" type="text" placeholder="domicilio">
            <span id="order-err"></span>
            <button id="buynowbtn" class="orderbtn">Ordenar</button>
            </div>`

            executeorders();
        } else {
            pedido.innerHTML = "";
        }
        console.log(globalemail);

    });
};

function executeorders() {
    let btn = document.getElementById('buynowbtn');
    let creditc = document.getElementById('cc');
    let address = document.getElementById('address');
    let err = document.getElementById('order-err');

    btn.addEventListener('click', event => {
        err.innerHTML = "";
        if (creditc.value.trim() === "" || address.value.trim() === "") {
            if (creditc.value.trim() === "") {
                err.innerHTML = "falta la informacion de la tarjeta";
            }
            if (address.value.trim() === "") {
                err.innerHTML = "falta la informacion de la direccion";
            }
            if (creditc.value.trim() === "" && address.value.trim() === "") {
                err.innerHTML = "falta la informacion de la tajeta & direccion ";
            }
        }

        if (err.innerHTML == "") {
            makeorders(creditc.value, address.value);
            creditc.value = "";
            address.value = "";

        }

    })
}

function makeorders(ccard, addr) {
    let cart = document.getElementById('item-list');
    let len = cart.childNodes.length;

    for (let i = 2; i < len; i++) {
        let productname = cart.childNodes[i].childNodes[0].childNodes[1].innerHTML;
        regex = /(<([^>]+)>)/ig
        productname = productname.replace(regex, "");
        buyorder(productname, globalemail, ccard, addr);
    }
    deleteShoppingCart();
}

function buyorder(productName, email, ccard, addr) {
    let url = '/orders';

    let data = {
        productName: productName,
        userEmail: email,
        creditcard: ccard,
        address: addr
    }
    console.log(data);
    let settings = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            console.log(responseJSON);
        })
        .catch(err => {
            console.log(err.message);
        })
}

function showOrders() {
    let url = `/orders/${globalemail}`;
    let settings = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    }

    let display = document.getElementById('order-list');
    display.innerHTML = `                    
    <tr>
        <th class="title"> Producto </th>
        <th class="title"> Direccion </th>
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
                </tr>`;
            })
        })
        .catch(err => {
            console.log(err.message);
        });
}

function deleteShoppingCart() {
    let url = `/shoppingcart/${globalemail}`;
    let settings = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    };

    fetch(url, settings)
        .then(() => {
            showOrders();
        })
        .catch(err => {
            console.log(err.message);
        })
}

function init() {
    hello();
    hacerpedido();
    showOrders();
}

init();