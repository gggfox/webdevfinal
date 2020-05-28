let mongoose = require('mongoose');

const ordersCollectionSchema = {
    id: {
        type: String,
        unique: true,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    creditcard: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
};

const orderCollection = mongoose.model('orders', ordersCollectionSchema);

const Orders = {
    getAllOrders: function() {
        return orderCollection
            .find()
            .then(orders => {
                return orders;
            })
            .catch(err => {
                throw new Error(err.message);
            });
    },
    getByUserEmail: function(email) {
        return orderCollection
            .find({ userEmail: email })
            .then(items => {
                return items;
            })
            .catch(err => {
                throw new Error(err.message);
            });
    },
    createItem: function(newItem) {
        return orderCollection
            .create(newItem)
            .then(createdItem => {
                return createdItem;
            })
            .catch(err => {
                throw new Error(err.message);
            });
    }
};

module.exports = { Orders };