let mongoose = require('mongoose');

const productCollectionSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    }
});

const productCollection = mongoose.model('products', productCollectionSchema);

const Products = {
    createProduct: function(newProduct) {
        return productCollection
            .create(newProduct)
            .then(createdProduct => {
                return createdProduct;
            })
            .catch(err => {
                return err;
            });
    },
    getAllProducts: function() {
        return productCollection
            .find()
            .then(allProducts => {
                return allProducts;
            })
            .catch(err => {
                return err;
            });
    },
    getProductByName: function(productName) {
        return productCollection
            .find({ name: productName })
            .then(results => {
                return results;
            })
            .catch(err => {
                return err;
            });
    },
    getProductsById: function(productId) {
        return productCollection
            .find({ id: productId })
            .then(results => {
                return results;
            })
            .catch(err => {
                return err;
            });
    },
    deleteProductById: function(productId) {
        return productCollection
            .deleteOne()
            .where('id').equals(productId)
            .then(result => {
                return result;
            })
            .catch(err => {
                return err;
            });
    },
    updateProductById: function(productId, updatedProduct) {
        return productCollection
            .updateOne({ id: productId }, { $set: updatedProduct }, { upsert: true })
            .then(results => {
                return results;
            })
            .catch(err => {
                return err;
            });
    }
};

module.exports = { Products };
//get all products
//get product by name
//delete product by id
//update product
//add new product