const express = require('express');
const expbs = require('express-handlebars');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('./middlewares/cors');
const { DATABASE_URL, PORT, SECRET_TOKEN } = require('./config');
const { Products } = require('./models/product');
const { Users } = require('./models/user');
const { ShoppingCarts } = require('./models/shoppingcart');
const { Orders } = require('./models/orders');
const validateApiKey = require('./middlewares/validateToken');
const jsonParser = bodyParser.json();
const path = require('path');
const app = express();
const expressHandlebarsSections = require('express-handlebars-sections');

app.use(cors);
app.use(express.static("views"));
app.use(morgan('dev'));
//app.use(validateApiKey);


app.engine('handlebars', expbs({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/mainLayout')
}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/shop', (req, res) => {
    res.render('shop', { title: 'Tienda' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

app.get('/videos', (req, res) => {
    res.render('videos', { title: 'Videos' });
});
app.get('/admin', (req, res) => {
    res.render('admin', { title: 'dashboard' });
});
app.get('/register', (req, res) => {
    res.render('register', { title: 'Registro' });
});
app.get('/profile', (req, res) => {
    res.render('profile', { title: 'Cuenta' });
});
/*=================================
=         SHOPPING CART           =
==================================*/

app.post('/shoppingcart', jsonParser, (req, res) => {
    let id = uuid.v4();
    console.log(req.body);
    let { userEmail, productName } = req.body;

    if (!userEmail || !productName) {
        res.statusMessage = "Some parameter is missing";
        return res.status(406).end();
    }
    let newItem = {
        id,
        userEmail,
        productName
    };

    ShoppingCarts
        .createItem(newItem)
        .then(result => {
            return res.status(201).json(result);
        })
        .catch(err => {
            console.log(err.message);
            res.statusMessage = "Something went wrong with the database";
            return res.status(500).end();
        });
});

app.get('/shoppingcart/:email', (req, res) => {
    let email = req.params.email;
    if (email === undefined) {
        res.statusMessage = "Please send the email as parameter.";
        return res.status(406).end();
    }

    ShoppingCarts
        .getByUserEmail(email)
        .then(results => {
            if (results.length > 0) {
                return res.status(200).json(results);
            } else {
                res.statusMessage = "There were no item with the provided email";
                return res.status(404).end();
            }
        })
        .catch(err => {
            res.statusMessage = " problems with the database";
            console.log(err);
            return res.status(401).end();
        });
});

app.get('/shoppingcart', (req, res) => {
    ShoppingCarts
        .getAllShoppingCarts()
        .then(results => {
            return res.status(200).json(results);
        })
        .catch(err => {
            res.statusMessage = " problems with the database";
            return res.status(401).end();
        });
});

app.delete('/shoppingcart/:id', (req, res) => {
    let id = req.params.id;
    if (!id) {
        res.statusMessage = "id wasnt sent";
        return res.status(406).end();
    }

    ShoppingCarts
        .deleteItem(id)
        .then(result => {
            res.statusMessage = "item has been succesfully removed";
            return res.status(200).end();
        })
        .catch(err => {
            res.statusMessage = "error in database";
            return res.status(404).end();
        })
});

app.delete('/shoppingcart/:email', (req, res) => {
    let userEmail = req.params.email;
    if (!userEmail) {
        res.statusMessage = "userEmail wasnt sent";
        return res.status(406).end();
    }

    ShoppingCarts
        .deleteAllItems(userEmail)
        .then(result => {
            res.statusMessage = "items has been succesfully removed";
            return res.status(200).end();
        })
        .catch(err => {
            res.statusMessage = "error in database";
            return res.status(404).end();
        })
});
/*=================================
=            Orders               =
==================================*/

app.get('/orders', (req, res) => {
    Orders
        .getAllOrders()
        .then(results => {
            return res.status(200).json(results);
        })
        .catch(err => {
            res.statusMessage = " problems with the database";
            return res.status(401).end();
        });
});

app.get('/orders/:email', (req, res) => {
    let email = req.params.email;
    if (email === undefined) {
        res.statusMessage = "Please send the email as parameter.";
        return res.status(406).end();
    }

    Orders
        .getByUserEmail(email)
        .then(results => {
            if (results.length > 0) {
                return res.status(200).json(results);
            } else {
                res.statusMessage = "There were no item with the provided email";
                return res.status(404).end();
            }
        })
        .catch(err => {
            res.statusMessage = " problems with the database";
            console.log(err);
            return res.status(401).end();
        });
});

app.post('/orders', jsonParser, (req, res) => {
    let id = uuid.v4();
    console.log(req.body);
    let { productName, userEmail, creditcard, address } = req.body;
    console.log(req.body);
    if (!userEmail || !productName || !creditcard || !address) {
        res.statusMessage = "Some parameter is missing";
        return res.status(406).end();
    }
    let newOrder = {
        id,
        productName,
        userEmail,
        creditcard,
        address
    };

    Orders
        .createItem(newOrder)
        .then(result => {
            return res.status(201).json(result);
        })
        .catch(err => {
            console.log(err.message);
            res.statusMessage = "Something went wrong with the database";
            return res.status(500).end();
        });
});
/*=================================
=            PRODUCTS             =
==================================*/
//get all the products

app.get('/products', (req, res) => {
    Products
        .getAllProducts()
        .then(results => {
            res.status(200).json(results);
        });
});

app.get('/product/:name', (req, res) => {
    let name = req.params.name;
    console.log(name);
    if (name === undefined) {
        res.statusMessage = "Please send the name as parameter.";
        return res.status(406).end();
    }

    Products
        .getProductByName(name)
        .then(results => {
            if (results.length > 0) {
                return res.status(200).json(results);
            } else {
                res.statusMessage = "There were no products with the provided name";
                return res.status(404).end();
            }
        })
        .catch(err => {
            res.statusMessage = " problems with the database";
            console.log(err);
            return res.status(401).end();
        });
});

app.post('/products', jsonParser, (req, res) => {
    let id = uuid.v4();
    console.log(req.body);
    let { name, description, precio } = req.body;
    console.log(name);
    console.log(description);
    console.log(precio);
    let newProduct = {
        id,
        name,
        description,
        precio
    };

    if (!name || !description || !precio) {
        res.statusMessage = "Some parameter was not pased through";
        return res.status(406).end();
    } else {
        Products
            .createProduct(newProduct)
            .then(result => {
                return res.status(201).json(result);
            })
            .catch(err => {
                res.statusMessage = "Something went wrong with the database";
                return res.status(500).end();
            });
    }

});

app.delete('/product/:id', (req, res) => {
    let id = req.params.id;
    if (!id) {
        res.statusMessage = "id wasnt sent";
        return res.status(406).end();
    }

    Products
        .deleteProductById(id)
        .then(result => {
            res.statusMessage = "product has been succesfully removed";
            return res.status(200).end();
        })
        .catch(err => {
            res.statusMessage = "error in database";
            return res.status(404).end();
        })
});

app.patch('/product/:id', jsonParser, (req, res) => {
        let id = req.params.id;
        if (!id) {
            res.statusMessage = "The id of the product is missing";
            res.status(406).end();
        }
        let { name, description, precio } = req.body;
        let updatedProduct = {
            name: name,
            description: description,
            precio: precio
        }

        Products
            .updateProductById(id, updatedProduct)
            .then(result => {
                if (result.nModified == 0) {
                    console.log("nothing was updated");
                } else {
                    console.log("product has been updated");
                }
                console.log(result);
                return res.status(201).end();
            })
            .catch(err => {
                console.log(`there has been an error in the db ${err}`);
                res.statusMessage = "error in database";
                return res.status(500).end()
            })


    })
    /*=================================
    =              USERS              =
    ==================================*/
app.get('/validate-token', (req, res) => {
    let token = req.headers.sessiontoken;

    jsonwebtoken.verify(token, SECRET_TOKEN, (err, decoded) => {
        if (err) {
            res.statusMessage = "Session expired!";
            return res.status(400).end();
        }
        return res.status(200).json(decoded);
    });
});

app.post('/users/login', jsonParser, (req, res) => {
    let { username, password } = req.body;

    if (!username || !password) {
        res.statusMessage = "Parameter missing in the body of the request.";
        return res.status(406).end();
    }

    Users
        .getUserByUsername(username)
        .then(user => {
            bcrypt.compare(password, user.password)
                .then(result => {
                    if (result) {

                        let userData = {
                            username: user.username,
                            email: user.email
                        }

                        jsonwebtoken.sign(userData, SECRET_TOKEN, { expiresIn: '30m' }, (err, token) => {
                            //console.log(token);
                            if (err) {
                                res.statusMessage = "error while generating the token.";
                                return res.status(400).end();
                            }
                            return res.status(200).json({ token });
                        });
                    } else {
                        throw new Error("Invalid credentials.");
                    }
                })
                .catch(err => {
                    res.statusMessage = err.message;
                    return res.status(400).end();
                });
        })
        .catch(err => {
            res.statusMessage = err.message;
            return res.status(400).end();
        });
});

app.post('/users/register', jsonParser, (req, res) => {
    let { username, email, password, isManager } = req.body;
    let id = uuid.v4();
    let salt = 10;
    if (isManager === undefined) {
        isManager = false;
    }
    if (!username || !email || !password) {
        res.statusMessage = "Parameter missing in the body of the request.";
        return res.status(406).end();
    }

    bcrypt.hash(password, salt)
        .then(hashedPassword => {
            let newUser = {
                id,
                email,
                username,
                password: hashedPassword,
                isManager
            };

            Users
                .createUser(newUser)
                .then(result => {
                    return res.status(201).json(result);
                })
                .catch(err => {
                    res.statusMessage = err.message;
                    return res.status(400).end();
                });
        })
        .catch(err => {
            res.statusMessage = err.message;
            return res.status(406).end();
        });
});

app.get('/users', (req, res) => {
    Users
        .getAllUsers()
        .then(result => {
            return res.status(201).json(result);
        })
        .catch(err => {
            res.statusMessage = err.message;
            return res.status(400).end();
        });
});

/*=================================
=               MAIN              =
==================================*/
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    new Promise((resolve, reject) => {
            const settings = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            };

            mongoose.connect(DATABASE_URL, settings, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("Database connected successfully.");
                    return resolve();
                }
            });
        })
        .catch(err => {
            mongoose.disconnect();
            console.log(err);
        });
});