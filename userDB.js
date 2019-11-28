var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    userType: String,
    gender: String,
    DOB: Date,
    about: String,
    rating: Number,
    phone: String,
    experience: [],
    address: String,
    approve: String
})

module.exports = mongoose.model('user', userSchema, 'User');