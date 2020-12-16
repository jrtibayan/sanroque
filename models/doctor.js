const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');


// Doctor Schema
const DoctorSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    middlename: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    bday: {
        type: String,
        required: true
    },
    suffix: {
        type: String,
        required: true
    },
    licenseno: {
        type: String,
        required: true
    },
    defaultPatho: {
        type: Boolean,
        required: true
    }
});


const Doctor = module.exports = mongoose.model('Doctor', DoctorSchema);


module.exports.getDoctorById = function(id, callback){
    Doctor.findById(id, callback);
}


module.exports.getDoctorByFullname = function(firstname, callback){
    const query = {firstname: firstname};
    Doctor.find(query, callback);
}


module.exports.getDoctors = function(query, callback){
    Doctor.find(query, callback);
}


module.exports.addDoctor = function(newDoctor, callback) {
    newDoctor.save(callback);
}

module.exports.deleteDoctor = function(doctor, callback) {
}