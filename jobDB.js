var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    jobId: Number,
    jobTitle: String,
    jobDesc: String,
    jobSalary: String,
    jobLocation: String,
    jobCity: String,
    jobState: String,
    jobStart: Date,
    jobEnd: Date,
    jobTime: String,
    companyEmail: String,
    candidateEmail:[]
})

module.exports = mongoose.model('job', userSchema, 'Job');
