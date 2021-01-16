const mongoose = require('mongoose');

// Patient Schema
const PatientSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname    : {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    birthDate: {
        type: String,
        required: true
    }
});

const Patient = module.exports = mongoose.model('Patient', PatientSchema);


module.exports.getPatientById = function(id, callback){
    Patient.findById(id, callback);
}

module.exports.getPatientByName = function(firstname, lastname, callback){
    const query = {firstname: firstname, lastname: lastname};
    Patient.findOne(query, callback);
}

module.exports.getMultiplePatientsByName = function(firstname, lastname, callback){
    const query = {firstname: firstname, lastname: lastname};
    Patient.find(query, callback);
}

//module.exports.getPatients = function(query, callback){
//    Role.find(query, callback);
//}

module.exports.addPatient = function(newPatient, callback) {
    console.log('Inside Patient Model - ADDPATIENT Start');

    newPatient.save(callback);
    
    console.log('Inside Patient Model - ADDPATIENT End');
}


module.exports.updatePatient = function(query, set) {
    options = { "multi": true };

    const res = Patient.updateOne(query, set, options, function (err) {
        if (err) return console.error(err);         
        console.log('Patient update successful');
    });
}