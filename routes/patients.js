const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const conf = require('config')

const h = require('../misc/helper')

const User = require('../models/user')

function registerUser (newUser, res) {
  User.getUserByEmail(
    newUser.email,
    (err, user) => {
      h.dlog('Finding user with email: ' + newUser.email)

      if (err) throw err

      if (user) {
        h.dlog('User already exist')
        return res.json({ success: false, msg: 'User already exist' })
      }

      h.dlog('User not found. Will add the user')

      h.dlog('Forward newUser to addUser function to add the user')
      User.addPatient(newUser, (err, user) => {
        if (err) {
          h.dlog('Error adding user')
          return res.json({ success: false, msg: 'Error adding user' })
        } else {
          h.dlog('User registered')
          //h.emailRegistrationSuccessful(user.email, newPassword)

          return res.json({ success: true, msg: 'User added' })
        }
      })
    }
  )
}

// Register
router.post(
  '/register',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    h.dlog('\n\n\nInside PATIENTS Route - REGISTER Start')
    h.dlog('Adding patient ' + req.body.last + ', ' + req.body.firstname)

    const user = req.body
    const newUser = new User({
      firstname: user.firstname,
      middlename: user.middlename,
      lastname: user.lastname,
      dateOfBirth: user.dateOfBirth,
      email: user.email,
      contactNumber: user.contactNumber
    })

    return registerUser(newUser, res)
  }
)

module.exports = router
