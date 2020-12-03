const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database')


const User = require('../models/user');


// Register
router.post(
    '/register', 
    (req, res, next) => {
        let newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            suffix: req.body.suffix,
            license: req.body.license,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        });

        User.addUser(newUser, (err, user) => {
            if(err) {
                res.json({success: false, msg: 'Failed to register user'});
            } else {
                res.json({success: true, msg: 'User registered'});
            }
        });
    }
);

// Change Password
router.post(
    '/update/password', 
    (req, res, next) => {
        console.log('\n\n\nUpdating User Password');

        let email = req.body.email;
        const password = req.body.password;
        let newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword;

        if(newPassword != confirmPassword) {
            console.log('New password and password confirmation does not match');
            return res.json({success: false, msg: 'New password and password confirmation does not match'});
        }

        User.getUserByEmail(
            email, 
            (err, user) => {
                console.log('Finding user with email: ' + email);

                if(err) throw err;

                if(!user) {
                    console.log('User not found');
                    return res.json({success: false, msg: 'User not found'});
                }
                
                console.log('User found');
                User.comparePassword(
                    password, 
                    user.password, 
                    (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch) {
                            console.log('Password Match');

                            // update the password
                            User.changePassword(email, newPassword);

                            return res.json({
                                success: true,
                                msg: 'Password updated'
                            });
                        } else {
                            console.log('Wrong password');
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
        console.log('\n\n\nAuthenticating User');
        const email = req.body.email;
        const password = req.body.password;

        // if tried to login using admin and password for credential
        // this will command the backend to check if there are existing users
        // if no users are found, register an initial user that have a system admin role
        // that user will then be able login and use the user registration form and add new users
        if(email === "admin" && password === "password") {
            console.log('Processing special user: admin');

            const query = {}; // this will get all from the collection

            User.getUsers(
                query,
                (err, users) => {
                    if(err) {
                        console.log('Failed to get users');
                        res.json({success: false, msg: 'Failed to get users'});
                    } else {
                        if(users.length > 0) {
                            console.log('Users exist ' + users[0].email);
                            console.log('Special procedure will be cancelled');
                            // users are found
                            // return error message
                            res.json({success: false, msg: 'Collection already populated'});
                        } else {
                            console.log('No user in the database');
                            console.log('Adding default admin user');

                            let newUser = new User({
                                firstname: 'Jeric',
                                lastname: 'Tibayan',
                                email: 'jrhod_baby@yahoo.com',
                                password: 's@password1',
                                role: 'admin'
                            });
                    
                            User.addUser(newUser, (err, user) => {
                                if(err) {
                                    console.log('Error adding default admin user');
                                    res.json({success: false, msg: 'Error adding default admin user'});
                                } else {
                                    console.log('Default admin user registered');
                                    res.json({success: true, msg: 'Default user added'});
                                }
                            });
                            
                        }
                        
                    }
                }
            );
        } else {
            User.getUserByEmail(
                email, 
                (err, user) => {
                    console.log('Processing user with email: ' + email);

                    if(err) throw err;

                    if(!user) {
                        console.log('User not found');
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
        res.json({user: req.user});
    }
);

module.exports = router;