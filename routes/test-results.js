const express = require('express')
const router = express.Router()
const passport = require('passport')

const h = require('../misc/helper')

const TestResult = require('../models/test-result')
const Patient = require('../models/user')

// Register
router.post(
  '/register',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    h.dlog('\n\n\nInside Test Result Route - REGISTER Result Start')
    h.dlog('Adding Result of ' + req.body.patientId)

    const userInput = req.body
    const newTestResult = new TestResult({
      resultDate: userInput.resultDate,
      patientId: userInput.patientId,
      testCategory: userInput.patientId,
      parameters: userInput.parameters,
      requestingPhysician: userInput.requestingPhysician,
      pathoLicense: userInput.pathoLicense,
      pathoName: userInput.pathoName,
      medTechLicense: userInput.medTechLicense,
      medTechName: userInput.medTechName
    })

    function getAge (dateString) {
      const today = new Date()
      const birthDate = new Date(dateString)

      let age = today.getFullYear() - birthDate.getFullYear()
      let m = today.getMonth() - birthDate.getMonth()

      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
        if (m < 0) m = 12 + m
      }

      return age + 'y ' + m + 'm'
    }

    Patient.getPatientById(
      userInput.patientId,
      (err, patient) => {
        if (err) {
          h.dlog('Error finding the patient')
          return res.json({ success: false, msg: 'Error finding the patient' })
        }

        newTestResult.patient = patient.lastname + ', ' + patient.firstname + ' ' + patient.middlename
        newTestResult.address = patient.address
        newTestResult.gender = patient.gender
        newTestResult.age = getAge(patient.dateOfBirth)

        TestResult.addTestResult(newTestResult, (err, testResult) => {
          if (err) {
            h.dlog('Error adding test result')
            return res.json({ success: false, msg: 'Error adding test result' })
          }

          h.dlog('TestResult registered')
          return res.json(h.appRes(
            { success: true, msg: 'TestResult added' },
            { id: newTestResult._id }
          ))
        })
      }
    )
  }
)

module.exports = router
