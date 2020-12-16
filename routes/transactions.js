const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database')


const Patient = require('../models/patient');
const Transaction = require('../models/transaction');

function appendLeadingZeroes(n){
    if(n <= 9){
        return "0" + n;
    }
    return n
}

function formatted_date(givenDate) {
    return givenDate.getFullYear() + "-" + (givenDate.getMonth() + 1) + "-" + givenDate.getDate() + " " + givenDate.getHours() + ":" + givenDate.getMinutes();// + ":" + givenDate.getSeconds()
}

function solveForAge(earlierDateString, laterDateString){
    function convertToDate(dateString) {

        dateString = dateString.split(' ');
        let givenDate = dateString[0].split('-');
        let givenTime = dateString[1].split(':');
        
        let newDate = new Date(
            parseInt(givenDate[0]), 
            parseInt(givenDate[1])-1, 
            parseInt(givenDate[2]), 
            parseInt(givenTime[0]), 
            parseInt(givenTime[1])
        );

        return newDate;
    }

    let earlierDate = convertToDate(earlierDateString);
    let laterDate = convertToDate(laterDateString);    

    let durationInMilliseconds = laterDate - earlierDate;
    let durationInDays = (((durationInMilliseconds/1000)/60/60)/24);
    let excessDays = durationInDays%365;
    let years = (durationInDays-(durationInDays%365))/365;
    let months = (excessDays-(excessDays%30))/30;

    return years + 'years ' + months + 'months';
}


// Register
router.post(
    '/register', 
    passport.authenticate('jwt', {session: false}), 
    (req, res, next) => {
        
        let searchId = req.body.patientId;

        // get patient informations
        Patient.getPatientById(
            searchId, 
            (err, patient) => {
                console.log('Finding patient with id: ' + searchId);

                if(err) throw err;

                if(!patient) {
                    console.log('Patient not found');
                    return res.json({success: false, msg: 'Patient not found'});
                }
                
                let current_datetime = new Date();

                let bDay_string = '1985-03-11 04:31';

                let age = solveForAge(bDay_string, formatted_date(current_datetime));

                // create new transaction
                let newTransaction = new Transaction({
                    patientId: patient._id,
                    name: patient.firstname + ' ' + patient.lastname,
                    address: patient.address,
                    date: formatted_date(current_datetime),
                    age: age,
                    tests: req.body.tests
                    //birthDate: formatted_bday
                });
                // try saving the transaction
                Transaction.addTransaction(newTransaction, (err, transaction) => {
                    if(err) {
                        console.log('Error adding transaction');
                        res.json({success: false, msg: 'Error adding transaction'});
                    } else {
                        console.log('Transaction registered');
                        res.json({success: true, msg: 'Transaction added'});
                    }
                });
            }
        );

    }
);


// Get List of Transaction
router.post(
    '/list',
    passport.authenticate('jwt', {session: false}), 
    (req, res, next) => {
        let firstname = req.body.firstname,
            lastname = req.body.lastname;

        Transaction.getMultipleTransactionsByName(
            firstname,
            lastname,
            (err, transactions) => {
                if(err) {
                    res.json({success: false, msg: 'Failed to get transactions'});
                } else {
                    if(transactions.length > 0) {
                        res.json({
                            success: true, 
                            msg: 'Transactions found',
                            transactions: transactions
                        });
                    } else {
                        res.json({success: false, msg: 'No transactions of that name'});
                    }
                }
            }
        );        
    }
);

module.exports = router;