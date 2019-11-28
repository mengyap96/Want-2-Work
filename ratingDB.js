var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    email: String,
    score: Number,
    comment: String,
    writer: String,
    jobId: Number
})

module.exports = mongoose.model('rating', userSchema, 'Rating');