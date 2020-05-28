let mongoose = require('mongoose');

const userCollectionSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isManager: {
        type: Boolean,
        required: true
    },

});

const userCollection = mongoose.model('users', userCollectionSchema);

const Users = {
    getAllUsers: function() {
        return userCollection
            .find()
            .then(allUsers => {
                return allUsers;
            })
            .catch(err => {
                return err;
            });
    },
    getUserByEmail: function(userEmail) {
        return userCollection
            .findOne({ userEmail })
            .then(user => {
                return user;
            })
            .catch(err => {
                throw new Error(err.message);
            });
    },
    getUserByUsername: function(username) {
        return userCollection
            .findOne({ username })
            .then(user => {
                return user;
            })
            .catch(err => {
                throw new Error(err.message);
            });
    },
    createUser: function(newUser) {
        return userCollection
            .create(newUser)
            .then(createdUser => {
                return createdUser;
            })
            .catch(err => {
                throw new Error(err.message);
            });
    },
    deleteUserByEmail: function(userEmail) {
        return userCollection
            .deleteOne()
            .where('email').equals(userEmail)
            .then(results => {
                return results;
            })
            .catch(err => {
                return err;
            });
    },
    updateUser: function(userEmail, updatedUser) {
        return userCollection
            .updateOne({ email: userEmail }, { $set: updatedUser }, { upsert: true })
            .then(results => {
                return results;
            })
            .catch(err => {
                return err;
            });
    }
};

module.exports = { Users };
//missing createing the database on mongodb
//delete user by username
//get all users
//get user by id
//update user password
//create a user
//change permissions
//module.exports = {}