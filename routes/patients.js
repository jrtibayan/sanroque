const express = require('express')
const router = express.Router()
const passport = require('passport')

const h = require('../misc/helper')

const User = require('../models/user')

function registerUser (newUser, res) {
  User.addPatient(newUser, (err, user) => {
    if (err) {
      h.dlog('Error adding user')
      return res.json({ success: false, msg: 'Error adding user' })
    }

    h.dlog('User registered')
    return res.json({ success: true, msg: 'User added' })
  })
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
