const mongoose = require('mongoose')

// TestResult Schema
const TestResultSchema = mongoose.Schema({
/*
    date
    patientId
    patient
    address
    gender
    age

    test catogory: testCategoryName

    parameters: [{
      parameter
      result
      normal value
    }]

    req physician
    pahthologist
    med tech
*/
  resultDate: {
    type: Date,
    required: true
  },
  // ALL
  patientId: {
    type: String,
    required: true
  },
  // ALL
  patient: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  testCategory: {
    type: String,
    required: true
  },
  parameters: {
    type: [{}],
    required: true
  },
  requestingPhysician: {
    type: String,
    required: true
  },
  pathoLicense: {
    type: String,
    required: true
  },
  pathoName: {
    type: String,
    required: true
  },
  medTechLicense: {
    type: String,
    required: true
  },
  medTechName: {
    type: String,
    required: true
  }
})

const TestResult = module.exports = mongoose.model('TestResult', TestResultSchema)

module.exports.getTestResultById = function (id, callback) {
  TestResult.findById(id, callback)
}

module.exports.addTestResult = function (newTestResult, callback) {
  // console.log('Inside TestResult Model - ADDUSER Start');

  // console.log('Will now encrypt the password');

  newTestResult.save(callback)

  // console.log('Inside TestResult Model - ADDUSER End');
}

module.exports.updateTestResult = function (query, set) {
  options = { multi: true }

  TestResult.updateOne(query, set, options, function (err) {
    if (err) return console.error(err)
    // console.log('TestResult update successful')
  })
}

module.exports.updateTest = function (requestId, changes) {
  query = { _id: requestId }
  update = { $set: changes }

  TestResult.updateTestResult(query, update)
}
