const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const Doctor = require('../models/doctor');
const { count } = require('../models/doctor');


// Register
router.post(
    '/register', 
    (req, res, next) => {
        let newDoctor = new Doctor({
            firstname: req.body.firstname,
            middlename: req.body.middlename,
            lastname: req.body.lastname,
            bday: req.body.bday,
            suffix: req.body.suffix,
            defaultPatho: false,
            licenseno: req.body.licenseno
        });

        Doctor.addDoctor(newDoctor, (err, doctor) => {
            if(err) {
                res.json({success: false, msg: 'Failed to register doctor'});
            } else {
                res.json({
                    success: true, 
                    msg: 'Doctor registered',
                    doctor: doctor
                });
            }
        });
    }
);

// Get List of Doctors
router.post(
    '/list',
    (req, res, next) => {
        const query = req.body;

        Doctor.getDoctors(
            query,
            (err, doctors) => {
                if(err) {
                    res.json({success: false, msg: 'Failed to get doctors'});
                } else {
                    if(doctors.length > 0) {
                        res.json({
                            success: true, 
                            msg: 'Doctor found',
                            doctors: doctors.length
                        });
                    } else {
                        res.json({success: false, msg: 'No doctor of that name'});
                    }
                }
            }
        );        
    }
);

module.exports = router;