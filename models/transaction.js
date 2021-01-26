const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Transaction Schema
const TransactionSchema = mongoose.Schema({
/*
    date
    patientId
    patient
    list of test
        chemgroupid    chemgroup1          100
        chemgroupid    chemgroup2          200
        chemgroupid    chemgroup3          150
        hemagroupid    hemagroup1          1000
        hemagroupid    hemagroup2          300
    list of payments []
    total 11000
    balance 0
*/
  requestDate: {
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
  requestedTests: {
    type: [Object],
    required: true
  },
  payments: {
    type: [Number],
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  balance: {
    type: Number,
    required: true
  }
})

const Transaction = module.exports = mongoose.model('Transaction', TransactionSchema)

module.exports.getTransactionById = function (id, callback) {
  Transaction.findById(id, callback)
}

module.exports.getTransactionByDate = function (tDates, callback) {
  // const start = tDates.start
  // const end = tDates.end

  // convert 

  const query = { email: email }

  Transaction.findOne(query, callback)
}

module.exports.getTransactions = function (query, callback) {
  Transaction.find(query, callback)
}

module.exports.addPatient = function (newPatient, callback) {
  // console.log('Inside Transaction Model - ADDUSER Start');

  // console.log('Will now encrypt the password');

  newPatient.save(callback)

  // console.log('Inside Transaction Model - ADDUSER End');
}

module.exports.addTransaction = function (newTransaction, callback) {
  // console.log('Inside Transaction Model - ADDUSER Start');

  // console.log('Will now encrypt the password');

  newTransaction.save(callback)

  // console.log('Inside Transaction Model - ADDUSER End');
}

module.exports.updateTransaction = function (query, set) {
  options = { multi: true }

  const res = Transaction.updateOne(query, set, options, function (err) {
    if (err) return console.error(err)
    // console.log('Transaction update successful');
  })
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  bcrypt.compare(
    candidatePassword,
    hash,
    (err, isMatch) => {
      if (err) throw err
      callback(null, isMatch)
    }
  )
}

module.exports.changePassword = function (email, password) {
  bcrypt.genSalt(
    10,
    (err, salt) => {
      if (err) throw err

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err

        newPassword = hash

        query = { email: email }
        update = { $set: { password: newPassword } }

        Transaction.updateTransaction(query, update)
        // console.log('Password updated');
      })
    }
  )
}
