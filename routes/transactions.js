const express = require('express')
const router = express.Router()
const passport = require('passport')

const h = require('../misc/helper')

const Transaction = require('../models/transaction')

// Register
router.post(
  '/register',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    h.dlog('\n\n\nInside TRANSACTIONS Route - REGISTER Start')
    h.dlog('Adding transaction ' + req.body.patient)

    const transaction = req.body
    const newTransaction = new Transaction({
      requestDate: transaction.requestDate,
      patientId: transaction.patientId,
      patient: transaction.patient,
      requestedTests: transaction.requestedTests,
      payments: [],
      total: 0,
      balance: 0
    })

    for (test in newTransaction.requestedTests) {
      newTransaction.total += test.price
    }
    newTransaction.balance = newTransaction.total

    newTransaction.balance = String(newTransaction.balance)
    newTransaction.total = String(newTransaction.total)

    Transaction.addTransaction(newTransaction, (err, transaction) => {
      if (err) {
        h.dlog('Error adding transaction')
        return res.json({ success: false, msg: 'Error adding transaction' })
      }

      h.dlog('Transaction registered')
      return res.json({ success: true, msg: 'Transaction added' })
    })
  }
)

module.exports = router
