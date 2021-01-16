const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const Patient = require('../models/patient');


// Register
router.post(
    '/register', 
    passport.authenticate('jwt', {session: false}), 
    (req, res, next) => {
        let newPatient = new Patient({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            address: req.body.address,
            birthDate: req.body.birthDate
        });

        newPatient.birthDate = newPatient.birthDate.split('-');
        newPatient.birthDate = new Date(newPatient.birthDate[0],newPatient.birthDate[1],newPatient.birthDate[2]);

        Patient.addPatient(newPatient, (err, patient) => {
            if(err) {
                res.json({success: false, msg: 'Failed to register patient'});
            } else {
                res.json({
                    success: true, 
                    msg: 'Patient registered',
                    patient: patient
                });
            }
        });
    }
);


// Get List of Patient
router.post(
    '/list',
    passport.authenticate('jwt', {session: false}), 
    (req, res, next) => {
        let firstname = req.body.firstname,
            lastname = req.body.lastname;

        Patient.getMultiplePatientsByName(
            firstname,
            lastname,
            (err, patients) => {
                if(err) {
                    res.json({success: false, msg: 'Failed to get patients'});
                } else {
                    if(patients.length > 0) {
                        res.json({
                            success: true, 
                            msg: 'Patients found',
                            patients: patients
                        });
                    } else {
                        res.json({success: false, msg: 'No patients of that name'});
                    }
                }
            }
        );        
    }
);

module.exports = router;