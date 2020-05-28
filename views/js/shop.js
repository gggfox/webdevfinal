const API_TOKEN = "'2abbf7c3-245b-404f-9473-ade729ed4653'";
let email = "";

function getEmail() {
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
            email = responseJSON.email;
        })
        .catch(err => {
            console.log(err.message);
        });
}

function sendToShoppingCart(item) {

    let url = '/shoppingcart';
    let data = {
        userEmail: email,
        productName: item
    };
    console.log(data);
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
                console.log(response);
            }
            throw new Error(response.statusText);
        })
        .catch(err => {
            console.log(err.message);
        });
}

function AddToCart() {
    let parent = document.getElementsByClassName('product_catalog');
    let len = parent[0].childNodes.length;

    for (let i = 0; i < len; i++) {
        parent[0].childNodes[i].childNodes[9].addEventListener('click', event => {
            if (email !== "") {
                sendToShoppingCart(parent[0].childNodes[i].childNodes[1].innerHTML.trim());
            } else {
                window.location.href = "/login";
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
    let shop_display = document.querySelector('.product_catalog');

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            shop_display.innerHTML = "";
            responseJSON.forEach(element => {
                let content = `<div class="shop-card">
                    <div class="title">
                        ${element.name}
                    </div>
                    <div class="desc">
                        gaming PC
                    </div>
                    <div class="slider">
                        <figure>
                            <img class="product-img"  alt="${element.description}" src="./public/images/${element.name}.png">
                        </figure>
                    </div>
                    <div class="price" >
                    $${element.precio}.00
                    </div>
                    <button class="btn">Añadir al Carrito <span class="bg"></span></button>
                </div>`;
                shop_display.innerHTML += content;
            });
            AddToCart();
        })
        .catch(err => {
            err.innerHTML = `<div> ${err.message} </div>`;
        });
}

function findOneProduct(query) {
    let url = `/product/${query}`;
    let settings = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    };
    let shop_display = document.querySelector('.product_catalog');
    shop_display.innerHTML = "";
    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            shop_display.innerHTML = "";
            responseJSON.forEach(element => {
                let content = `<div class="shop-card">
                <div class="title">
                    ${element.name}
                </div>
                <div class="desc">
                    gaming PC
                </div>
                <div class="slider">
                    <figure>
                        <img class="product-img" src="./public/images/${element.name}.png" alt="${element.description}">
                    </figure>
                </div>
                    <div class="price">$${element.precio}.00</div>
                    <button class="btn">Añadir al Carrito </button>
            </div>`;
                shop_display.innerHTML += content;
            });
            AddToCart();
        })
        .catch(err => {
            err.innerHTML = `<div> ${err.message} </div>`;
        });
}

function watchProductSearch() {
    let searchbtn = document.querySelector('.search-btn');
    searchbtn.addEventListener('click', event => {
        event.preventDefault();
        let search_bar = document.querySelector('.search-box');

        if (search_bar.value.replace(/\s/g, '') !== "") {
            findOneProduct(search_bar.value);
        } else {
            getAllProducts();
        }
    })
}

function init() {
    getAllProducts();
    watchProductSearch();
    getEmail();
}

init();