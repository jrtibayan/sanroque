const express = require('express')
const router = express.Router()
const passport = require('passport')

const h = require('../misc/helper')

const Transaction = require('../models/transaction')

// Register
router.post(
  '/register/request',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    h.dlog('\n\n\nInside TRANSACTIONS Route - REGISTER Request Start')
    h.dlog('Adding Request by ' + req.body.patient)

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

    for (let i = 0; i < newTransaction.requestedTests.length; i++) {
      newTransaction.total = newTransaction.total + newTransaction.requestedTests[i].price
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
      return res.json(h.appRes(
        { success: true, msg: 'Transaction added' },
        { id: newTransaction._id }
      ))
    })
  }
)

// Register
router.post(
  '/register/payment',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const requestId = req.body.requestId
    const paymentDate = req.body.paymentDate
    const paymentAmount = req.body.amount

    h.dlog('\n\n\nInside TRANSACTIONS Route - REGISTER Payment Start')
    h.dlog('Adding Payment for Test Request ID ' + requestId)

    Transaction.getTransactionById(
      requestId,
      (err, request) => {
        if (err) {
          h.dlog('Failed to find test request')
          return res.json({ success: false, msg: 'Failed to find test request' })
        }

        request.payments.push({ pDate: paymentDate, pAmount: paymentAmount })
        request.balance = request.balance - paymentAmount

        Transaction.updatePayments(
          requestId,
          {
            payments: request.payments,
            balance: request.balance
          }
        )

        return res.json({ success: true, msg: 'Transaction added' })
      }
    )
  }
)

module.exports = router
