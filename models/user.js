const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const sender = require('../config/gmail');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: sender.email,
      pass: sender.password
    }
});


// User Schema
const UserSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    suffix: {
        type: String
    },
    license: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});


const User = module.exports = mongoose.model('User', UserSchema);


module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}


module.exports.getUserByEmail = function(email, callback){
    const query = {email: email};
    User.findOne(query, callback);
}

module.exports.getUsers = function(query, callback){
    User.find(query, callback);
}

module.exports.addUser = function(newUser, callback) {

    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
    newUser.password = randomString(12, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');


    const mailOptions = {
        from: sender.email,
        to: newUser.email,
        subject: 'San Roque | You are now a registered user',
        text: 'Congratulations!\n\nYou are now registered to San Roque App.\nPlease use the credentials below for your first login.\nYou may change the password anytime from your dashboard.\n\nEmail: ' + newUser.email + '\nPassword: ' + newUser.password
    };


    bcrypt.genSalt(
        10, 
        (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;                
                newUser.password = hash;
                newUser.save(callback);
            });
        }
    );


    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}


module.exports.updateUser = function(query, set) {
    options = { "multi": true };

    const res = User.updateOne(query, set, options, function (err) {
        if (err) return console.error(err);         
        console.log('User update successful');
    });
}


module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(
        candidatePassword, 
        hash, 
        (err, isMatch) => {
            if(err) throw err;
            callback(null, isMatch);
        }
    );
}

module.exports.changePassword = function(email, password) {
    
    bcrypt.genSalt(
        10, 
        (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if(err) throw err;                
                newPassword = hash;

                query = {"email": email};
                update = {"$set": {"password": newPassword}};
                
                User.updateUser(query, update);
                console.log('Password updated');
            });
        }
    );

    
}