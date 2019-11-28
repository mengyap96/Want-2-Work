var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    jobId: Number,
    candidateEmail: String,
    companyEmail: String,
    status: String,
    ratedCompany: Boolean,
    ratedCandidate: Boolean
})

module.exports = mongoose.model('jobStatus', userSchema, 'JobStatus');
