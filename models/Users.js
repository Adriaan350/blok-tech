const mongoose = require('mongoose');
require('../connect.js')

const UserForm = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true,
    },
    age: {
        type: String,
        require: true,
    }
});

const Users = mongoose.model('Users', UserForm);

module.exports = Users;