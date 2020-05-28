let mongoose = require('mongoose');

const shoppingCartCollectionSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    userEmail: {
        type: String,
        required: true,
        unique: false
    },
    productName: {
        type: String,
        required: true,
        unique: false
    }

});

const shoppingCartCollection = mongoose.model('shopping-carts', shoppingCartCollectionSchema);

const ShoppingCarts = {
    getAllShoppingCarts: function() {
        return shoppingCartCollection
            .find()
            .then(items => {
                return items;
            })
            .catch(err => {
                throw new Error(err.message);
            });
    },
    getByUserEmail: function(email) {
        return shoppingCartCollection
            .find({ userEmail: email })
            .then(items => {
                return items;
            })
            .catch(err => {
                throw new Error(err.message);
            });
    },
    createItem: function(newItem) {
        return shoppingCartCollection
            .create(newItem)
            .then(createdItem => {
                return createdItem;
            })
            .catch(err => {
                throw new Error(err.message);
            });
    },
    deleteItem: function(id) {
        return shoppingCartCollection
            .deleteOne()
            .where('id').equals(id)
            .then(results => {
                return results;
            })
            .catch(err => {
                return err;
            });
    },
    deleteAllItems: function(email) {
        return shoppingCartCollection
            .deleteMany()
            .where('userEmail').equals(email)
            .then(results => {
                return results;
            })
            .catch(err => {
                return err;
            });
    },
};

module.exports = { ShoppingCarts };