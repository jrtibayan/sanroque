const express = require('express')
const router = express.Router()
const passport = require('passport')

const h = require('../misc/helper')

const Patient = require('../models/user')

// Register
router.post(
  '/register',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    h.dlog('\n\n\nInside PATIENTS Route - REGISTER Start')
    h.dlog('Adding patient ' + req.body.last + ', ' + req.body.firstname)

    const patient = req.body
    const newUser = new Patient({
      firstname: patient.firstname,
      middlename: patient.middlename,
      lastname: patient.lastname,
      dateOfBirth: patient.dateOfBirth,
      email: patient.email,
      contactNumber: patient.contactNumber
    })

    Patient.addPatient(newUser, (err, patient) => {
      if (err) {
        h.dlog('Error adding patient')
        return res.json({ success: false, msg: 'Error adding patient' })
      }

      h.dlog('Patient registered')
      return res.json(h.appRes(
        { success: true, msg: 'Patient added' },
        { id: newUser._id, fullname: newUser.lastname + ', ' + newUser.firstname}
      ))
    })
  }
)

module.exports = router
