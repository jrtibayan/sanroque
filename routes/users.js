const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
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

const User = require('../models/user');
const Role = require('../models/role');

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function emailRegistrationSuccessful(email, password) {
    const mailOptions = {
        from: sender.email,
        to: email,
        subject: 'San Roque | You are now a registered user',
        text: 'Congratulations!\n\nYou are now registered to San Roque App.\nPlease use the credentials below for your first login.\nYou may change the password anytime from your dashboard.\n\nEmail: ' + email + '\nPassword: ' + password
    };
    //console.log('Prepared mailOptions for mailing later');

    //console.log('Will now email user his/her new password');
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            //console.log('Failed to email the user');
            //console.log(error);
        } else {
            //console.log('Email sent');
        }
    });
}

function registerUser(newUser, newPassword, res) {
    User.getUserByEmail(
        newUser.email, 
        (err, user) => {
            //console.log('Finding user with email: ' + newUser.email);

            if(err) throw err;

            if(user) {
                //console.log('User already exist');
                return res.json({success: false, msg: 'User already exist'});
            }
            
            //console.log('User not found. Will add the user');
            
            //console.log('Forward newUser to addUser function to add the user');
            User.addUser(newUser, (err, user) => {
                if(err) {
                    //console.log('Error adding user');
                    res.json({success: false, msg: 'Error adding user'});
                } else {
                    //console.log('User registered');
                    res.json({success: true, msg: 'User added'});

                    emailRegistrationSuccessful(user.email, newPassword);
                }
            });
        }
    );
}

function prepareNewUser(user) {
    const newPassword = randomString(12, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    //console.log('Generated random password for the user');
    
    var newUser = null;
    if(user.email == 'jrhod_baby@yahoo.com') {
        newUser = new User({
            firstname: 'Jeric',
            lastname: 'Tibayan',
            email: 'jrhod_baby@yahoo.com',
            //password: newPassword,
            password: 'password',
            role: 'admin'
        });
        //console.log('Prepared newUser');
    } else {
        newUser = new User({
            firstname: user.firstname,
            lastname: user.lastname,
            suffix: user.suffix,
            license: user.license,
            email: user.email,
            password: newPassword,
            role: user.role
        });
    }
    //console.log('Prepared newUser');
    return newUser;
}

// Register
router.post(
    '/register', 
    passport.authenticate('jwt', {session: false}), 
    (req, res, next) => {
        //console.log('\n\n\nInside USER Route - REGISTER Start');
        //console.log('Adding user with emailad ' + req.body.email);

        let newUser = prepareNewUser(req.body);
        let searchRole = req.user.role;

        // using user.role find what allowedActions for role
        Role.getRoleByName(
            searchRole, 
            (err, role) => {
                //console.log('Finding role with name: ' + searchRole);

                if(err) throw err;

                if(!role) {
                    //console.log('Role not found');
                    return res.json({success: false, msg: 'Role not found'});
                }
                
                let allowedActions = role.allowedActions;
                //console.log(role.allowedActions);

                if(allowedActions.includes('register ' + newUser.role)) {
                    registerUser(newUser, newUser.password, res);
                } else {
                    //console.log('User not allowed to register ' + newUser.role);
                    res.json({success: false, msg: 'User not allowed to register ' + newUser.role});
                }
            }
        );

        //console.log('Inside USER Route - REGISTER End');
    }
);

// Change Password
router.post(
    '/update/password', 
    (req, res, next) => {
        //console.log('\n\n\nUpdating User Password');

        let email = req.body.email;
        const password = req.body.password;
        let newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;

        if(newPassword != confirmPassword) {
            //console.log('New password and password confirmation does not match');
            return res.json({success: false, msg: 'New password and password confirmation does not match'});
        }

        User.getUserByEmail(
            email, 
            (err, user) => {
                //console.log('Finding user with email: ' + email);

                if(err) throw err;

                if(!user) {
                    //console.log('User not found');
                    return res.json({success: false, msg: 'User not found'});
                }
                
                //console.log('User found');
                User.comparePassword(
                    password, 
                    user.password, 
                    (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch) {
                            //console.log('Password Match');

                            // update the password
                            User.changePassword(email, newPassword);

                            return res.json({
                                success: true,
                                msg: 'Password updated'
                            });
                        } else {
                            //console.log('Wrong password');
                            return res.json({success: false, msg: 'Wrong password'});
                        }
                    }
                );
            }
        );

    }
);


// Authenticate
router.post(
    '/authenticate', 
    (req, res, next) => {
        //console.log('\n\n\nAuthenticating User');
        const email = req.body.email;
        const password = req.body.password;

        // if tried to login using admin and password for credential
        // this will command the backend to check if there are existing users
        // if no users are found, register an initial user that have a system admin role
        // that user will then be able login and use the user registration form and add new users
        if(email === "admin" && password === "password") {
            //console.log('Processing special user: admin');

            const query = {}; // this will get all from the collection

            User.getUsers(
                query,
                (err, users) => {
                    if(err) {
                        //console.log('Failed to get users');
                        res.json({success: false, msg: 'Failed to get users'});
                    } else {
                        if(users.length > 0) {
                            //console.log('Users exist ' + users[0].email);
                            //console.log('Special procedure will be cancelled');
                            res.json({success: false, msg: 'Collection already populated'});
                        } else {
                            //console.log('No user in the database');
                            //console.log('Adding default admin user');

                            // No user must mean the app is new so I must check important databases if it exist

                            let newUser = prepareNewUser({email: 'jrhod_baby@yahoo.com'});
                    
                            registerUser(newUser, newUser.password, res);
                        }
                    }
                }
            );
        } else {
            User.getUserByEmail(
                email, 
                (err, user) => {
                    //console.log('Processing user with email: ' + email);

                    if(err) throw err;

                    if(!user) {
                        //console.log('User not found');
                        return res.json({success: false, msg: 'User not found'});
                    }
                    
                    User.comparePassword(
                        password, 
                        user.password, 
                        (err, isMatch) => {
                            if(err) throw err;

                            if(isMatch) {
                                function convertToPlainObj(src) {
                                    return JSON.parse(JSON.stringify(src));
                                }

                                const token = jwt.sign(convertToPlainObj(user), config.secret);

                                res.json({
                                    success: true,
                                    msg: 'You are now logged in',
                                    token: 'JWT ' + token,
                                    user: {
                                        id: user._id,
                                        firstname: user.firstname,
                                        lastname: user.lastname,
                                        suffix: user.suffix,
                                        email: user.email,
                                        role: user.role,
                                    }
                                });
                            } else {
                                return res.json({success: false, msg: 'Wrong password'});
                            }
                        }
                    );
                }
            );
        }

        
        
    }
);


// Profile
router.get(
    '/profile', 
    passport.authenticate('jwt', {session: false}), 
    (req, res, next) => { 
        res.json({
            success: true,
            user: {
                firstname: 'Jeric',
                lastname: 'Tibayan',
                email: 'jrhod_baby@yahoo.com',
                role: 'admin'
            }
        });
    }
);



// testing
router.post(
    '/test',
    passport.authenticate('jwt', {session: false}), 
    (req, res, next) => {
        res.json({
            success: true, 
            firstname: req.user.firstname,
            lastname: req.user.lastname,
            email: req.user.email,
            friends: req.user.friends
        });
    }
);




module.exports = router;