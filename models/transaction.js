const mongoose = require('mongoose')

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
    type: [{}],
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

module.exports.addTransaction = function (newTransaction, callback) {
  // console.log('Inside Transaction Model - ADDUSER Start');

  // console.log('Will now encrypt the password');

  newTransaction.save(callback)

  // console.log('Inside Transaction Model - ADDUSER End');
}

module.exports.updateTransaction = function (query, set) {
  options = { multi: true }

  Transaction.updateOne(query, set, options, function (err) {
    if (err) return console.error(err)
    // console.log('Transaction update successful')
  })
}

module.exports.updatePayments = function (requestId, changes) {
  query = { _id: requestId }
  update = { $set: changes }

  Transaction.updateTransaction(query, update)
}
